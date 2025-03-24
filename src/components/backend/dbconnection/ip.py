import requests

ip = requests.get('https://api.ipify.org').text
response = requests.get(f"http://ip-api.com/json/{ip}").json()

print(f"IP Address: {ip}")
print(f"City: {response['city']}, {response['regionName']}, {response['country']}")
print(f"Latitude: {response['lat']}, Longitude: {response['lon']}")
print(f"Time Zone: {response['timezone']}")
