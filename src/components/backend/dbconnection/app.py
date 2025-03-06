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

# Email Configuration
app.config["MAIL_SERVER"] = "smtp.gmail.com"  # Use your SMTP server
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USERNAME"] = "alpenchristy459@gmail.com"  # Your email
app.config["MAIL_PASSWORD"] = "mwrb uylg ggai ggac"  # App password (not your actual email password)

mail = Mail(app)

CORS(app)
bcrypt = Bcrypt(app)

# Database Configuration
db_config = {
    "host": "162.241.116.193",
    "user": "ejaik1cd_bikanelite_dev",
    "password": "Isha#1234567",
    "database": "ejaik1cd_bikanelite_dev"
}

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

        if not all([first_name, last_name, email, mobile_number, password, confirm_password]):
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

        # Insert user into database with formatted ID
        cursor.execute(
            """
            INSERT INTO BKLWM_AUTH_USER (ID, FIRST_NAME, LAST_NAME, EMAIL_ID, PASSWORD, CREATED_DATE, LAST_LOGIN, IS_USER_ACTIVE, USERNAME, MOBILE_NUMBER) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (user_id, first_name, last_name, email, hashed_password, created_date, last_login, 1, username, mobile_number)
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
        last_login_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cursor.execute("UPDATE BKLWM_AUTH_USER SET LAST_LOGIN = %s WHERE EMAIL_ID = %s", (last_login_time, email))
        conn.commit()

        # Generate session key
        session_key = str(uuid.uuid4())
        session_data = json.dumps({"user_id": user["ID"], "email": email})
        expire_date = (datetime.now() + timedelta(hours=2)).strftime("%Y-%m-%d %H:%M:%S")  # Session expires in 2 hours

        # Store session in DB
        cursor.execute(
            "INSERT INTO BKLWM_SESSION (SESSION_KEY, SESSION_DATA, EXPIRE_DATE) VALUES (%s, %s, %s)",
            (session_key, session_data, expire_date)
        )
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message": "Login successful", "session_key": session_key}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500




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
        msg = Message("Password Reset OTP", sender="alpenchristy459@gmail.com", recipients=[email])
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
        sender_email = "alpenchristy459@gmail.com"  # Replace with your email
        sender_password = "mwrb uylg ggai ggac"  # Replace with your password
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
