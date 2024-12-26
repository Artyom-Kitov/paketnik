import requests

def create_service(name, port, hex_color):
    url = "http://127.0.0.1:8080/api/services"
    headers = {
        "accept": "*/*",
        "Content-Type": "application/json"
    }
    data = {
        "name": name,
        "port": port,
        "hexColor": hex_color
    }

    response = requests.post(url, headers=headers, json=data)
    print(f"Creating {name} (port {port}):")
    print(f"HTTP status code: {response.status_code}")
    print(f"Response: {response.text}\n")

services = [
    {"name": "service8082", "port": 8082, "hexColor": "#e01b24"},
    {"name": "service8083", "port": 8083, "hexColor": "#f6d32d"},
    {"name": "service8084", "port": 8084, "hexColor": "#2ec27e"},
    {"name": "service8085", "port": 8085, "hexColor": "#986a44"}
]

if __name__ == "__main__":
    for service in services:
        create_service(service["name"], service["port"], service["hexColor"])
