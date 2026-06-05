import os
import json
import requests
from flask import request
from database_service import current_dir


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