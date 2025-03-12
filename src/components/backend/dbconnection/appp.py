from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector
import json
import base64

# Load database config
with open('dbconfig.json', 'r') as file:
    config = json.load(file)['db_config']

app = Flask(__name__)
CORS(app)  # ✅ Add CORS to allow cross-origin requests

@app.route('/api/vehicles', methods=['GET'])
def get_vehicles():
    try:
        # Connect to the database
        conn = mysql.connector.connect(
            host=config['host'],
            user=config['user'],
            password=config['password'],
            database=config['database']
        )
        cursor = conn.cursor(dictionary=True)

        # Fetch vehicle data
        cursor.execute("SELECT vehicle_number, npr_image, detection_time FROM LICENSE_PLATES")
        vehicles = cursor.fetchall()

        # Encode binary image data to base64 string
        for vehicle in vehicles:
            if vehicle['npr_image']:
                vehicle['npr_image'] = base64.b64encode(vehicle['npr_image']).decode('utf-8')

        return jsonify(vehicles)

    except mysql.connector.Error as err:
        print(f"❌ Database Error: {err}")
        return jsonify({"error": str(err)}), 500

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == '__main__':
    app.run(debug=True)
