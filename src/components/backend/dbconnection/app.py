from flask import redirect, request, jsonify
import pymysql
import uuid
import json
import random
import requests
import time
from datetime import datetime, timedelta
import smtplib
from flask_mail import Message
import os

from email_service import send_activation_email, send_otp_email, send_email
from database_service import app, current_dir, SENDER_EMAIL, mail, get_db_connection, generate_unique_id, bcrypt,db_config,sms_config

from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.middleware.proxy_fix import ProxyFix


@app.route('/activate/<token>', methods=['GET'])
def activate_account(token):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT EMAIL_ID FROM BKLWM_AUTH_USER WHERE VERIFICATION_TOKEN = %s AND IS_USER_ACTIVE = 0", (token,))
    user = cursor.fetchone()

    if user:
        cursor.execute("UPDATE BKLWM_AUTH_USER SET IS_USER_ACTIVE = 1, VERIFICATION_TOKEN = NULL WHERE VERIFICATION_TOKEN = %s", (token,))
        conn.commit()
        cursor.close()
        conn.close()
        return redirect("http://localhost:3000/login")
    else:
        cursor.close()
        conn.close()
        return jsonify({"message": "Invalid or already activated account"}), 400


@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.json
        first_name = data.get("firstName")
        last_name = data.get("lastName")
        email = data.get("email")
        mobile_number = data.get("mobileNumber")
        password = data.get("password")
        confirm_password = data.get("confirmPassword")
        country = data.get("country")
        phone_code = data.get("phoneCode")

        if not all([first_name, last_name, email, mobile_number, password, confirm_password, country, phone_code]):
            return jsonify({"error": "All fields are required"}), 400

        if password != confirm_password:
            return jsonify({"error": "Passwords do not match"}), 400

        if len(mobile_number) < 10 or len(mobile_number) > 15:
            return jsonify({"error": "Invalid mobile number"}), 400

        hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
        user_id = generate_unique_id()  # Get unique formatted ID
        created_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        last_login = created_date  # Set last login same as created date initially

        username = email.split('@')[0]  # Generate username from email prefix
        verification_token = str(uuid.uuid4())

        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if email already exists
        cursor.execute("SELECT * FROM BKLWM_AUTH_USER WHERE EMAIL_ID = %s", (email,))
        existing_user = cursor.fetchone()
        if existing_user:
            return jsonify({"error": "User already exists"}), 400
        
        cursor.execute(
            """
            INSERT INTO BKLWM_AUTH_USER (
                ID, FIRST_NAME, LAST_NAME, EMAIL_ID, PASSWORD, CREATED_DATE, 
                LAST_LOGIN, IS_USER_ACTIVE, USERNAME, MOBILE_NUMBER,VERIFICATION_TOKEN, COUNTRY, PHONE_CODE,PASSWORD_CHANGE_COUNT
            ) 
            VALUES (
                %(user_id)s, %(first_name)s, %(last_name)s, %(email)s, %(hashed_password)s, %(created_date)s, 
                %(last_login)s, %(is_user_active)s, %(username)s, %(mobile_number)s,%(verification_token)s, %(country)s, %(phone_code)s,%(password_change_count)s
            )
            """,
            {
                "user_id": user_id,
                "first_name": first_name,
                "last_name": last_name,
                "email": email,
                "hashed_password": hashed_password,
                "created_date": created_date,
                "last_login": last_login,
                "is_user_active": 0,
                "username": username,
                "mobile_number": mobile_number,
                "verification_token": verification_token,
                "country": country,
                "phone_code": phone_code,
                "password_change_count": 0 

            }
        )

        
        conn.commit()
        cursor.close()
        conn.close()

        # Send Activation Email
        send_activation_email(email, verification_token)

        return jsonify({
            "message": "User registered successfully. Check your email to activate your account.",
            "user_id": user_id,
            "username": username
        }), 201

    except pymysql.MySQLError as db_err:
        return jsonify({"error": f"Database error: {str(db_err)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500
    
# SESSION_FILE_PATH = "src/components/backend/dbconnection/session/session.json"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SESSION_FILE_PATH = os.path.join(current_dir, "session", "session.json")
    
# Improved IP detection
def get_client_ip():
    headers = request.headers
    if headers.get('X-Forwarded-For'):
        return headers.get('X-Forwarded-For').split(',')[0].strip()
    if headers.get('X-Real-IP'):
        return headers.get('X-Real-IP')
    if request.remote_addr == '127.0.0.1':
        try:
            return requests.get('https://api64.ipify.org').text.strip()
        except Exception as e:
            print(f"Error fetching external IP: {e}")
            return "127.0.0.1"
    return request.remote_addr

# Location detection
def get_location(ip):
    try:
        response = requests.get(f"https://ipinfo.io/{ip}/json", timeout=5).json()
        loc = response.get("loc", "0,0").split(",")
        return {
            "city": response.get("city", "Unknown"),
            "latitude": float(loc[0]),
            "longitude": float(loc[1]),
            "timezone": response.get("timezone", "UTC")
        }
    except Exception as e:
        print(f"Error with ipinfo.io: {e}")
    return {"city": "Unknown", "latitude": 0.0, "longitude": 0.0, "timezone": "UTC"}

# Save session to JSON file
def save_session_to_file(session_data):
    try:
        with open(SESSION_FILE_PATH, "w") as f:
            json.dump(session_data, f, indent=4)
        print("Session data saved to session.json")
    except Exception as e:
        print(f"Error saving session data: {e}")

# Read session from JSON file
def read_session_from_file():
    try:
        if os.path.exists(SESSION_FILE_PATH):
            with open(SESSION_FILE_PATH, "r") as f:
                return json.load(f)
    except Exception as e:
        print(f"Error reading session data: {e}")
    return None

# Delete session file
def delete_session_file():
    try:
        if os.path.exists(SESSION_FILE_PATH):
            os.remove(SESSION_FILE_PATH)
            print("Session file deleted")
    except Exception as e:
        print(f"Error deleting session file: {e}")

@app.route("/api/user/status", methods=["GET"])
def user_status():
    session = read_session_from_file()
    if session.get("userId"):
        return jsonify({
            "isAuthenticated": True,
            "userId": session.get("userId"),
            "isTrialUsed": session.get("isTrialUsed", False)
        })
    return jsonify({"isAuthenticated": False})

@app.route("/api/subscription/select-plan", methods=["POST"])
def select_plan():
    data = request.json
    session = read_session_from_file()
    session.update({
        "selectedPlan": data.get("plan"),
        "billingCycle": data.get("billingCycle")
    })
    save_session_to_file(session)
    return jsonify({"message": "Plan selected successfully"})

@app.route("/api/subscription/start-trial", methods=["POST"])
def start_trial():
    data = request.json
    session = read_session_from_file()
    session["isTrialUsed"] = True
    session["trialEndsAt"] = data.get("trialEndsAt")
    save_session_to_file(session)
    return jsonify({"message": "Trial started"})

@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM BKLWM_AUTH_USER WHERE EMAIL_ID = %s", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "Invalid credentials"}), 401

        # Verify password
        if not bcrypt.check_password_hash(user["PASSWORD"], password):
            return jsonify({"error": "Invalid credentials"}), 401

        user_ip = get_client_ip()
        print(f"Detected IP: {user_ip}")

        location_data = get_location(user_ip)
        print(f"Location Data: {location_data}")

        last_login_time = datetime.now()
        cursor.execute("UPDATE BKLWM_AUTH_USER SET LAST_LOGIN = %s WHERE EMAIL_ID = %s", (last_login_time, email))
        conn.commit()

        session_key = str(uuid.uuid4())
        session_data = {
            "user_id": user["ID"],
            "ip_address": user_ip,
            "city": location_data["city"],
            "latitude": location_data["latitude"],
            "longitude": location_data["longitude"],
            "timezone": location_data["timezone"],
            "session_key": session_key,
            "expire_date": (datetime.now() + timedelta(hours=2)).isoformat(),
            "created_date": last_login_time.isoformat(),
            "is_active": 1
        }

        save_session_to_file(session_data)

        cursor.close()
        conn.close()

        return jsonify({
            "message": "Login successful",
            "session_key": session_key,
            "first_name": user["FIRST_NAME"],
            "email": email
        }), 200

    except Exception as e:
        print(f"Error during login: {e}")
        return jsonify({"error": str(e)}), 500
    
@app.after_request
def apply_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
    return response
otp_store = {}  # Store OTPs temporarily

# Get absolute path to the session.json file
def load_session_data():
    try:
        with open(SESSION_FILE_PATH, 'r') as f:
            data = json.load(f)
            print("✅ Session data loaded:", data)
            return data
    except FileNotFoundError:
        print("❌ Session file not found at:", SESSION_FILE_PATH)
        return {}
    except json.JSONDecodeError:
        print("❌ Session file contains invalid JSON.")
        return {}

def save_session_data(session_data):
    try:
        with open(SESSION_FILE_PATH, 'w') as f:
            json.dump(session_data, f, indent=4)
            print("✅ Session data saved at:", SESSION_FILE_PATH)
    except Exception as e:
        print("❌ Failed to save session:", str(e))

@app.route("/reset-password-request", methods=["POST"])
def reset_password_request():
    if request.method == "OPTIONS":
        return '', 200

    data = request.get_json()
    old_password = data.get("oldPassword")
    new_password = data.get("newPassword")

    # Load session and get user_id directly
    session_data = load_session_data()
    user_id = session_data.get("user_id")

    if not user_id:
        return jsonify({"error": "Session expired or not found"}), 401

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Fetch user by ID
        cursor.execute("SELECT PASSWORD, EMAIL_ID FROM BKLWM_AUTH_USER WHERE ID = %s", (user_id,))
        user = cursor.fetchone()

        if not user or not bcrypt.check_password_hash(user["PASSWORD"], old_password):
            return jsonify({"error": "Old password is incorrect"}), 400

        # Generate OTP
        otp = str(random.randint(100000, 999999))
        email = user["EMAIL_ID"]
        otp_store[email] = {
            "otp": otp,
            "timestamp": time.time(),
            "new_password": new_password  # temporarily store the new password
        }

        # Send OTP email
        try:
            send_otp_email(email, otp)
        except Exception as e:
            print("Mail error:", e)
            return jsonify({"error": "Failed to send OTP email"}), 500

        return jsonify({"message": "OTP sent to your email"}), 200

    except pymysql.MySQLError as db_err:
        return jsonify({"error": f"Database error: {str(db_err)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500
    
@app.route("/update-password", methods=["POST"])
def update_password():
    try:
        data = request.get_json()
        otp = data.get("otp")
        
        # Load user_id from session
        session_data = load_session_data()
        user_id = session_data.get("user_id")
        if not user_id:
            return jsonify({"error": "User not authenticated"}), 401
        
        

        # Fetch user's email from DB
        conn = get_db_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)  # to access keys like a dictionary
        cursor.execute("SELECT EMAIL_ID ,PASSWORD_CHANGE_COUNT FROM BKLWM_AUTH_USER WHERE ID = %s", (user_id,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if not user:
            return jsonify({"error": "User not found"}), 404

        email = user["EMAIL_ID"]
        current_count = user.get("PASSWORD_CHANGE_COUNT", 0)

        # Check if OTP exists for this email
        otp_data = otp_store.get(email)
        if not otp_data:
            print("❌ No OTP data found for:", email)
            return jsonify({"error": "Invalid or expired OTP"}), 400

        # Debug print to verify OTP comparison
        print("🔐 Received OTP:", otp)
        print("📦 Stored OTP:", otp_data["otp"])

        # Check if OTP matches
        if str(otp_data["otp"]) != str(otp).strip():
            return jsonify({"error": "Invalid OTP"}), 400

        # Check if OTP is expired
        if time.time() - otp_data["timestamp"] > 300:
            otp_store.pop(email, None)
            return jsonify({"error": "OTP expired"}), 400

        # Hash and update the new password
        new_password = otp_data["new_password"]
        hashed_password = bcrypt.generate_password_hash(new_password).decode("utf-8")

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE BKLWM_AUTH_USER SET PASSWORD = %s,PASSWORD_CHANGE_COUNT = %s WHERE ID = %s", (hashed_password, current_count + 1,user_id))
        conn.commit()
        cursor.close()
        conn.close()

        # Clear OTP
        otp_store.pop(email, None)

        return jsonify({"message": "Password updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500

@app.route("/logout", methods=["POST"])
def logout():
    try:
        data = request.get_json()
        if not data or "session_key" not in data:
            return jsonify({"error": "Session key is required"}), 400

        session_key = data["session_key"].strip()
        session_data = read_session_from_file()

        if not session_data or session_data["session_key"] != session_key:
            return jsonify({"error": "Invalid or expired session"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO BKLWM_SESSION (SESSION_KEY, SESSION_DATA, EXPIRE_DATE, CREATED_DATE, IP_ADDRESS, IS_ACTIVE)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (
                session_data["session_key"],
                json.dumps(session_data),
                session_data["expire_date"],
                session_data["created_date"],
                session_data["ip_address"],
                0
            )
        )

        conn.commit()

        delete_session_file()

        cursor.close()
        conn.close()

        return jsonify({"message": "Logout successful"}), 200

    except Exception as e:
        print(f"Error during logout: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/forgot-password", methods=["POST", "OPTIONS"])
def forgot_password():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200
    try:
        data = request.json
        email = data.get("email")#get email

        if not email:
            return jsonify({"error": "Email is required"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if user exists
        cursor.execute("SELECT * FROM BKLWM_AUTH_USER WHERE EMAIL_ID = %s", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "User not found"}), 404

        mobile = user["MOBILE_NUMBER"]#get mobile number

        if not mobile:
            return jsonify({"error": "Mobile number not found for user"}), 400
        
        # Generate a 6-digit OTP
        otp = str(random.randint(100000, 999999))
        expire_time = (datetime.now() + timedelta(minutes=10)).strftime("%Y-%m-%d %H:%M:%S")  # OTP expires in 10 minutes

        # Store OTP in RESET_OTP field
        cursor.execute("UPDATE BKLWM_AUTH_USER SET RESET_OTP = %s WHERE EMAIL_ID = %s", (otp, email))
        conn.commit()
        cursor.close()
        conn.close()

        #send otp via sms
        try:
            print("sms_config keys:", sms_config.keys())
            smsalert_url = "https://www.smsalert.co.in/api/push.json"
            message_text = f"Your verification code for https://www.ejaikisan.com is {otp}."
            
            sms_params = {
                "apikey": sms_config["api_key"],
                "mobileno": mobile,
                "text": message_text,
                "sender": sms_config["sender_id"],
                "route": sms_config["route"]
            }

            print(f" Sending SMS: {message_text} to {mobile}")
            sms_response = requests.get(smsalert_url, params=sms_params, timeout=10)
            sms_result = sms_response.json()

            print(f" SMSAlert Response: {sms_result}")

            if sms_result.get("status") == "success":
                desc = sms_result.get("description", {})
                batch_id = desc.get("batchid")
                msg_id = desc.get("batch_dtl", [{}])[0].get("msgid")

                print(f" SMS queued successfully | Batch ID: {batch_id} | Msg ID: {msg_id}")
            else:
                print(f" SMS failed: {sms_result}")

        except Exception as sms_err:
            print("SMS exception (NOT API):", repr(sms_err))


        # Send OTP via email
        try:
            msg = Message("Password Reset OTP", sender="Bikanelite-WM <"+SENDER_EMAIL+">", recipients=[email])
            msg.body = f"Your OTP for password reset is: {otp}. It will expire in 10 minutes."
            mail.send(msg)
            return jsonify({"message": "OTP sent via Email & SMS","channels": ["email", "sms"]}), 20
        except smtplib.SMTPException as smtp_error:
            return jsonify({"error": f"SMTP error: {smtp_error}"}), 500

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({"error": str(e)}), 500
                



@app.route("/reset-password", methods=["POST"])
def reset_password():
    try:
        data = request.json
        email = data.get("email")
        otp = data.get("otp")
        new_password = data.get("newPassword")
        confirm_password = data.get("confirmPassword")

        if not all([email, otp, new_password, confirm_password]):
            return jsonify({"error": "All fields are required"}), 400

        if new_password != confirm_password:
            return jsonify({"error": "Passwords do not match"}), 400

        conn = get_db_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)#empty it once

        # Fetch stored OTP from RESET_OTP column
        cursor.execute("SELECT * FROM BKLWM_AUTH_USER WHERE EMAIL_ID = %s", (email,))
        user = cursor.fetchone()

        print("Stored OTP:", user["RESET_OTP"])  # Debugging print
        print("Entered OTP:", otp)  # Debugging print

        if not user or str(user["RESET_OTP"]) != str(otp):
            return jsonify({"error": "Invalid OTP"}), 400

        # Hash new password
        hashed_password = bcrypt.generate_password_hash(new_password).decode("utf-8")

        # Update password and clear OTP
        cursor.execute("UPDATE BKLWM_AUTH_USER SET PASSWORD = %s, RESET_OTP = NULL WHERE EMAIL_ID = %s", (hashed_password, email))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message": "Password reset successful"}), 200

    except Exception as e:
        print("Exception:", str(e))  # Debugging print
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)