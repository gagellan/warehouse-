from flask import Flask, redirect, request, jsonify
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import pymysql
import uuid
import json
import random
import requests
import time
import ssl
from flask import make_response

from datetime import datetime, timedelta

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask_mail import Mail, Message
import smtplib
import os

from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.middleware.proxy_fix import ProxyFix


app = Flask(__name__)
# Ensure Flask trusts proxy headers
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_host=1) 

# Load database 
current_dir = os.path.dirname(os.path.abspath(__file__))
config_path = os.path.join(current_dir, "dbconfig.json")

if os.path.exists(config_path):
    with open(config_path, "r") as config_file:
        config_data = json.load(config_file)
else:
    raise FileNotFoundError(f"Config file not found at {config_path}")

db_config = config_data["db_config"]

SMTP_SERVER = config_data["smtp"]["server"]  
SMTP_PORT = config_data["smtp"]["port"]
SENDER_EMAIL = config_data["smtp"]["sender_email"]
SENDER_PASSWORD = config_data["smtp"]["sender_password"]

EMAIL_SUBJECT = config_data["email_template"]["subject"]
EMAIL_BODY_TEMPLATE = config_data["email_template"]["body"]

mail = Mail(app)

CORS(app)
bcrypt = Bcrypt(app)

def get_db_connection():
    return pymysql.connect(
        host=db_config["host"],
        user=db_config["user"],
        password=db_config["password"],
        database=db_config["database"],
        cursorclass=pymysql.cursors.DictCursor
    )

def generate_unique_id():
    """Generates a unique ID in the format GGSBWM_XXXX"""
    conn = get_db_connection()
    cursor = conn.cursor()

    while True:
        random_number = random.randint(1000, 9999)  # Generate 4-digit random number
        user_id = f"GGSBWM_{random_number}"

        # Check if ID already exists
        cursor.execute("SELECT ID FROM BKLWM_AUTH_USER WHERE ID = %s", (user_id,))
        existing_id = cursor.fetchone()
        
        if not existing_id:  # If ID does not exist, return it
            cursor.close()
            conn.close()
            return user_id
        
# Send Activation Email
def send_activation_email(to_email, token):
    try:
        activation_link = f"http://127.0.0.1:5000/activate/{token}"
        
        msg = MIMEMultipart()
        msg["From"] = SENDER_EMAIL
        msg["To"] = to_email
        msg["Subject"] = EMAIL_SUBJECT

        email_body = EMAIL_BODY_TEMPLATE.replace("{activation_link}", activation_link)
        msg.attach(MIMEText(email_body, "html"))

        server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT)
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, to_email, msg.as_string())
        server.quit()

        print(f"Activation email sent to {to_email}")
    except Exception as e:
        print(f"Email Error: {str(e)}")

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

def send_otp_email(to_email, otp):
    subject = "Your OTP for Password Reset"
    body = f"""
    <html>
        <body>
            <p>Hello,</p>
            <p>Your OTP to reset the password is: <strong>{otp}</strong></p>
            <p>This OTP is valid for 5 minutes. If you did not request this, please ignore this email.</p>
        </body>
    </html>
    """

    msg = MIMEMultipart()
    msg["From"] = SENDER_EMAIL
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "html"))

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, to_email, msg.as_string())

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
        send_otp_email(email, otp)
        print(f"📧 OTP sent to {email}: {otp}")

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

if __name__ == '__main__':
    app.run(debug=True)
















import random

@app.route("/forgot-password", methods=["POST"])
def forgot_password():
    try:
        data = request.json
        email = data.get("email")

        if not email:
            return jsonify({"error": "Email is required"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if user exists
        cursor.execute("SELECT * FROM BKLWM_AUTH_USER WHERE EMAIL_ID = %s", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "User not found"}), 404

        # Generate a 6-digit OTP
        otp = str(random.randint(100000, 999999))
        expire_time = (datetime.now() + timedelta(minutes=10)).strftime("%Y-%m-%d %H:%M:%S")  # OTP expires in 10 minutes

        # Store OTP in RESET_OTP field
        cursor.execute("UPDATE BKLWM_AUTH_USER SET RESET_OTP = %s WHERE EMAIL_ID = %s", (otp, email))
        conn.commit()

        # Send OTP via email
        msg = Message("Password Reset OTP", sender="ishasolanki0225@gmail.com", recipients=[email])
        msg.body = f"Your OTP for password reset is: {otp}. It will expire in 10 minutes."
        mail.send(msg)

        cursor.close()
        conn.close()

        return jsonify({"message": "OTP sent to your email"}), 200

    except smtplib.SMTPException as smtp_error:
        return jsonify({"error": f"SMTP error: {smtp_error}"}), 500
    except Exception as e:
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
        cursor = conn.cursor()

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

def send_email(to_email, reset_link):
    try:
        sender_email = "ishasolanki0225@gmail.com"  # Replace with your email
        sender_password = "grcq gjmz ispg egmg"  # Replace with your password
        subject = "Password Reset Request"

        message = MIMEMultipart()
        message["From"] = sender_email
        message["To"] = to_email
        message["Subject"] = subject
        body = f"Click the link below to reset your password:\n\n{reset_link}"
        message.attach(MIMEText(body, "plain"))

        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, to_email, message.as_string())
        server.quit()

        print("Password reset email sent.")

    except Exception as e:
        print(f"Error sending email: {e}")


if __name__ == "__main__":
    app.run(debug=True)