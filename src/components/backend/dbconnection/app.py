from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import pymysql
import uuid
import json
import random
from datetime import datetime, timedelta

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask_mail import Mail, Message
import smtplib


app = Flask(__name__)

with open(r"D:\bikanelite-wm\src\components\backend\dbconnection\dbconfig.json", "r") as config_file:
    config_data = json.load(config_file)

db_config = config_data["db_config"]

# Email Configuration
app.config["MAIL_SERVER"] = "smtp.gmail.com"  # Use your SMTP server
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USERNAME"] = "ishasolanki0225@gmail.com"  # Your email
app.config["MAIL_PASSWORD"] = "grcq gjmz ispg egmg"  # App password (not your actual email password)

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
                LAST_LOGIN, IS_USER_ACTIVE, USERNAME, MOBILE_NUMBER, COUNTRY, PHONE_CODE
            ) 
            VALUES (
                %(user_id)s, %(first_name)s, %(last_name)s, %(email)s, %(hashed_password)s, %(created_date)s, 
                %(last_login)s, %(is_user_active)s, %(username)s, %(mobile_number)s, %(country)s, %(phone_code)s
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
                "is_user_active": 1,
                "username": username,
                "mobile_number": mobile_number,
                "country": country,
                "phone_code": phone_code
            }
        )

        
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "User registered successfully", "user_id": user_id}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

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

        # Check if user exists
        cursor.execute("SELECT * FROM BKLWM_AUTH_USER WHERE EMAIL_ID = %s", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "Invalid credentials"}), 401

        # Verify password
        if not bcrypt.check_password_hash(user["PASSWORD"], password):
            return jsonify({"error": "Invalid credentials"}), 401

        # Update last login timestamp
        last_login_time = datetime.now()
        cursor.execute("UPDATE BKLWM_AUTH_USER SET LAST_LOGIN = %s WHERE EMAIL_ID = %s", (last_login_time, email))
        conn.commit()

        # Generate session key
        session_key = str(uuid.uuid4())
        session_data = json.dumps({"user_id": user["ID"], "email": email})
        expire_date = datetime.now() + timedelta(hours=2)

        # Insert session into the database
        cursor.execute(
            """
            INSERT INTO BKLWM_SESSION (SESSION_KEY, SESSION_DATA, EXPIRE_DATE, CREATED_DATE, IP_ADDRESS, IS_ACTIVE)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (session_key, session_data, expire_date, last_login_time, request.remote_addr or "127.0.0.1", 1)
        )
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({
            "message": "Login successful",
            "session_key": session_key,
            "first_name": user["FIRST_NAME"]
        }), 200

    except Exception as e:
        print(f"Error during login: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/test", methods=["POST"])
def test():
    print("Test endpoint hit!", flush=True)
    return jsonify({"message": "Test successful"})


@app.route("/logout", methods=["POST"])
def logout():
    print("Logout endpoint hit!", flush=True)
    try:
        data = request.get_json()
        if not data:
            print("No data received in request")
            return jsonify({"error": "Invalid request body"}), 400

        session_key = data.get("session_key")

        if not session_key:
            return jsonify({"error": "Session key is required"}), 400

        # ✅ Strip and normalize session key
        session_key = session_key.strip()

        conn = get_db_connection()

        # ✅ Use a default cursor
        cursor = conn.cursor()

        # ✅ Set isolation level to avoid transaction visibility issues
        cursor.execute("SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED")

        print(f"Received session key: '{session_key}'")

        # ✅ Add backticks to avoid keyword conflicts
        cursor.execute(
            "SELECT `SESSION_KEY` FROM `BKLWM_SESSION` WHERE `SESSION_KEY` = %s",
            (session_key,)
        )
        session = cursor.fetchone()
        session_key_from_db = session['SESSION_KEY']

        cursor.execute(
            "SELECT `IS_ACTIVE` FROM `BKLWM_SESSION` WHERE `SESSION_KEY` = %s",
            (session_key,)
        )
        active = cursor.fetchone()
        is_active = active['IS_ACTIVE']

        if not session:
            print("Session not found or already inactive")
            return jsonify({"error": "Invalid or already logged out"}), 400

        # ✅ Unpack values correctly
        

        # ✅ Debug raw byte values
        print(f"Session key from request (bytes): {session_key.encode()}")
        print(f"Session key from DB (bytes): {session_key_from_db}")

        print(f"Current IS_ACTIVE value: {is_active}")

        if not is_active:
            print("Session is already inactive")
            return jsonify({"error": "Session already logged out"}), 400

        # ✅ Fix UPDATE using backticks and direct matching
        cursor.execute(
            "UPDATE `BKLWM_SESSION` SET `IS_ACTIVE` = %s WHERE `SESSION_KEY` = %s",
            (0, session_key_from_db)
        )

        # ✅ Check if row was updated
        if cursor.rowcount == 0:
            print("No rows updated — possible session key mismatch or already inactive")
            return jsonify({"error": "Session key mismatch or already inactive"}), 400

        conn.commit()

        print(f"Session {session_key_from_db} deactivated successfully")

        cursor.close()
        conn.close()

        return jsonify({"message": "Logout successful"}), 200

    except Exception as e:
        print(f"Error during logout: {str(e)}", flush=True)
        return jsonify({"error": f"Server error: {str(e)}"}), 500













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
