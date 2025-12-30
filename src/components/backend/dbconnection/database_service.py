
import random
from flask import Flask
from flask_cors import CORS
from flask_mail import Mail
from flask_bcrypt import Bcrypt
import pymysql
import json
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

#   Flask-Mail Configuration
app.config['MAIL_SERVER'] = SMTP_SERVER
app.config['MAIL_PORT'] = SMTP_PORT
app.config['MAIL_USERNAME'] = SENDER_EMAIL
app.config['MAIL_PASSWORD'] = SENDER_PASSWORD
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_DEBUG'] = True
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
