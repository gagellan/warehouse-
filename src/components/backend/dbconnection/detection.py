import cv2
from ultralytics import YOLO
from datetime import datetime
import os
import time
import re
import mysql.connector
import json
import numpy as np
import easyocr

# Load YOLO model
model = YOLO('./models/license_plate_detector.pt')

# Create output folder for plates
output_folder = 'plates'
os.makedirs(output_folder, exist_ok=True)

# Load database config
with open('dbconfig.json', 'r') as file:
    config = json.load(file)['db_config']

# Initialize EasyOCR reader
reader = easyocr.Reader(['en'])

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

def insert_into_db(vehicle_number, plate_image, timestamp):
    try:
        conn = mysql.connector.connect(
            host=config['host'],
            user=config['user'],
            password=config['password'],
            database=config['database']
        )
        cursor = conn.cursor()

        query = """
        INSERT INTO LICENSE_PLATES (vehicle_number, npr_image, detection_time) 
        VALUES (%s, %s, %s)
        """

        with open(plate_image, 'rb') as file:
            image_data = file.read()

        cursor.execute(query, (vehicle_number, image_data, timestamp))
        conn.commit()

        print("✅ Data inserted into the database successfully!")

    except mysql.connector.Error as err:
        print(f"❌ Database Error: {err}")

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

def log_plate(plate_text, image, clarity_score):
    timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    filename = os.path.join(output_folder, f"{timestamp}.jpg")
    cv2.imwrite(filename, image)
    print(f"✅ Plate '{plate_text}' saved with clarity score {clarity_score:.2f} as '{filename}'")
    return filename

cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

if not cap.isOpened():
    print("❌ Error: Could not open webcam.")
    exit()

print("🚀 Starting live feed. Waiting 10 seconds to start detection...")

start_time = time.time()
last_capture_time = None
detection_started = False
results = None

while True:
    ret, frame = cap.read()
    if not ret:
        print("❌ Error: Failed to capture frame.")
        break

    current_time = time.time()

    if not detection_started and (current_time - start_time) >= 10:
        print("✅ Starting license plate detection...")
        detection_started = True
        last_capture_time = current_time - 40

    if detection_started and (current_time - last_capture_time) >= 40:
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

                        # Insert into DB
                        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                        insert_into_db(final_plate, saved_image, timestamp)

                        last_capture_time = current_time
                        break
            
            if last_capture_time == current_time:
                break

    display_frame = frame.copy()
    if results is not None:
        display_frame = results[0].plot()

    cv2.imshow("Live License Plate Detection", display_frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

print("✅ License plate detection completed.") 
