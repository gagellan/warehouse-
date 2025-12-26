from flask import Flask, jsonify, Response
from flask_cors import cross_origin, CORS
#import mysql.connector
import json
import base64
import cv2
import os
import re
import numpy as np
import time
from datetime import datetime
from ultralytics import YOLO
import easyocr
from flask import send_from_directory


# Load database config
with open('dbconfig.json', 'r') as file:
    config = json.load(file)['db_config']

# Initialize Flask
app = Flask(__name__, static_url_path='/static', static_folder='plates')
CORS(app)

# Load YOLO model
model = YOLO('./models/license_plate_detector.pt')

# Create output folder for plates
output_folder = 'plates'
os.makedirs(output_folder, exist_ok=True)

# Initialize EasyOCR reader
reader = easyocr.Reader(['en'])

# OpenCV video capture
# cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
# if not cap.isOpened():
#     raise Exception("❌ Error: Could not open webcam.")

last_capture_time = 0

# --------- Utility Functions ---------
def is_image_clear(image, threshold=0.55):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
    clarity = laplacian_var / 100.0
    return clarity > threshold, clarity

def extract_text_from_plate(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    text_list = reader.readtext(gray, detail=0, allowlist="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
    text = "".join(text_list).strip()
    text = re.sub(r'[^A-Z0-9]', '', text)
    return text

def correct_plate_format(text):
    match = re.match(r"^([A-Z]{2})([A-Z0-9]{2})([A-Z]{1,3})(\d{1,4})$", text)
    if match:
        state_code = match.group(1)
        rto_code = match.group(2)
        series = match.group(3)
        reg_number = match.group(4)

        rto_code = re.sub(r'[^0-9]', '0', rto_code)
        series = re.sub(r'[^A-Z]', '', series)

        return f"{state_code} {rto_code} {series} {reg_number}"
    return text


# ✅ Path to the JSON file
json_file = 'plates_data.json'
image_folder = 'plates'  # Folder to store plate images
os.makedirs(image_folder, exist_ok=True)

def insert_into_json(vehicle_number, plate_image, timestamp):
    try:
        # Read existing data (if any)
        if os.path.exists(json_file):
            with open(json_file, 'r') as file:
                data = json.load(file)
        else:
            data = []

        # ✅ Save file path instead of base64
        image_filename = os.path.basename(plate_image)
        image_path = os.path.join(image_folder, image_filename)

        # Save plate image to folder
        os.rename(plate_image, image_path)

        # Create new entry
        new_entry = {
            "vehicle_number": vehicle_number,
            "npr_image_path": image_filename,  # ✅ Store path only
            "detection_time": timestamp
        }

        # Append new entry to data
        data.append(new_entry)

        # Save back to JSON file
        with open(json_file, 'w') as file:
            json.dump(data, file, indent=4)

        print("✅ Data inserted into JSON file successfully!")

    except Exception as err:
        print(f"❌ JSON Error: {err}")




# def insert_into_db(vehicle_number, plate_image, timestamp):
#     try:
#         conn = mysql.connector.connect(
#             host=config['host'],
#             user=config['user'],
#             password=config['password'],
#             database=config['database']
#         )
#         cursor = conn.cursor()

#         query = """
#         INSERT INTO LICENSE_PLATES (vehicle_number, npr_image, detection_time) 
#         VALUES (%s, %s, %s)
#         """
#         with open(plate_image, 'rb') as file:
#             image_data = file.read()

#         cursor.execute(query, (vehicle_number, image_data, timestamp))
#         conn.commit()

#         print("✅ Data inserted into the database successfully!")

#     except mysql.connector.Error as err:
#         print(f"❌ Database Error: {err}")

#     finally:
#         if conn.is_connected():
#             cursor.close()
#             conn.close()

@app.route('/plates/<path:filename>')
def get_plate_image(filename):
    print(f"📸 Requested image: {filename}")
    return send_from_directory(image_folder, filename)


@app.route('/api/vehicles', methods=['GET'])
def get_vehicles():
    try:
        if os.path.exists(json_file):
            with open(json_file, 'r') as file:
                data = json.load(file)
            return jsonify(data)
        else:
            return jsonify([])

    except Exception as err:
        print(f"❌ JSON Error: {err}")
        return jsonify({"error": str(err)}), 500




def log_plate(plate_text, image, clarity_score):
    timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    filename = os.path.join(output_folder, f"{timestamp}.jpg")
    cv2.imwrite(filename, image)
    print(f"✅ Plate '{plate_text}' saved with clarity score {clarity_score:.2f} as '{filename}'")
    return filename

# --------- Video Feed Generator ---------
def generate_frames():
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

    if not cap.isOpened():
        print("❌ Error: Could not open webcam.")
        return
    
    detection_interval = 40
    start_time = time.time()
    last_capture_time = start_time - detection_interval
    detection_started = False

    print("🚀 Starting live feed. Waiting 10 seconds to start detection...")

    try:
        while True:
            success, frame = cap.read()
            if not success:
                print("❌ Error: Failed to capture frame.")
                break

            current_time = time.time()

            if not detection_started and (current_time - start_time) >= 10:
                print("✅ Starting license plate detection...")
                detection_started = True
                last_capture_time = current_time - detection_interval

            if detection_started and (current_time - last_capture_time) >= detection_interval:
                print("🔍 Detecting plate...")

                results = model(frame)

                for result in results:
                    for box in result.boxes:
                        x1, y1, x2, y2 = map(int, box.xyxy[0])
                        plate_img = frame[y1:y2, x1:x2]

                        if plate_img.size == 0:
                            continue

                        is_clear, clarity_score = is_image_clear(plate_img)

                        if is_clear:
                            raw_plate_text = extract_text_from_plate(plate_img)
                            if raw_plate_text:
                                final_plate = correct_plate_format(raw_plate_text)
                                saved_image = log_plate(final_plate, plate_img, clarity_score)

                                # ✅ Insert into JSON file
                                timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                                insert_into_json(final_plate, saved_image, timestamp)

                                last_capture_time = current_time
                                break

                    if last_capture_time == current_time:
                        break

            if detection_started and results is not None:
                frame = results[0].plot()

            _, buffer = cv2.imencode('.jpg', frame)
            frame_bytes = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

    finally:
        cap.release()
        print("📷 Camera released.")


# --------- Flask Routes ---------
@app.route('/video_feed')
@cross_origin()
def video_feed():
    # ✅ Open camera only when the route is accessed
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


# @app.route('/api/vehicles', methods=['GET'])
# def get_vehicles():
#     try:
#         conn = mysql.connector.connect(
#             host=config['host'],
#             user=config['user'],
#             password=config['password'],
#             database=config['database']
#         )
#         cursor = conn.cursor(dictionary=True)

#         cursor.execute("SELECT vehicle_number, npr_image, detection_time FROM LICENSE_PLATES ORDER BY detection_time DESC;")
#         vehicles = cursor.fetchall()

#         for vehicle in vehicles:
#             if vehicle['npr_image']:
#                 vehicle['npr_image'] = base64.b64encode(vehicle['npr_image']).decode('utf-8')

#         return jsonify(vehicles)

#     except mysql.connector.Error as err:
#         print(f"❌ Database Error: {err}")
#         return jsonify({"error": str(err)}), 500

#     finally:
#         if conn.is_connected():
#             cursor.close()
#             conn.close()

if __name__ == '__main__':
    app.run(debug=True)
