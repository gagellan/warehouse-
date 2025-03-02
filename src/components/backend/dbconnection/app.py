from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import pymysql
import uuid
import json
import random
from datetime import datetime, timedelta

app = Flask(__name__)
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

if __name__ == "__main__":
    app.run(debug=True)
