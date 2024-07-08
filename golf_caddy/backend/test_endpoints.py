import requests
import json

BASE_URL = "http://127.0.0.1:5000"

def test_home():
    response = requests.get(f"{BASE_URL}/")
    print("Home Endpoint Status Code:", response.status_code)
    print("Home Endpoint Raw Response:", response.text)
    try:
        print("Home Endpoint JSON Response:", response.json())
    except requests.exceptions.JSONDecodeError as e:
        print("JSONDecodeError:", e)

def test_save_pre_round_info():
    data = {
        "user_id": "user123",
        "course": "Pebble Beach",
        "tee_time": "08:00",
        "weather": "Sunny"
    }
    response = requests.post(f"{BASE_URL}/save_pre_round_info", json=data)
    print("Save Pre-round Info Endpoint Status Code:", response.status_code)
    print("Save Pre-round Info Endpoint Raw Response:", response.text)
    try:
        print("Save Pre-round Info Endpoint JSON Response:", response.json())
    except requests.exceptions.JSONDecodeError as e:
        print("JSONDecodeError:", e)

def test_get_pre_round_info():
    user_id = "user123"
    response = requests.get(f"{BASE_URL}/get_pre_round_info/{user_id}")
    print("Get Pre-round Info Endpoint Status Code:", response.status_code)
    print("Get Pre-round Info Endpoint Raw Response:", response.text)
    try:
        print("Get Pre-round Info Endpoint JSON Response:", response.json())
    except requests.exceptions.JSONDecodeError as e:
        print("JSONDecodeError:", e)

def test_chat():
    data = {
        "user_id": "user123",
        "input": "What club should I use for a 150 yard shot?"
    }
    response = requests.post(f"{BASE_URL}/chat", json=data)
    print("Chat Endpoint Status Code:", response.status_code)
    print("Chat Endpoint Raw Response:", response.text)
    try:
        print("Chat Endpoint JSON Response:", response.json())
    except requests.exceptions.JSONDecodeError as e:
        print("JSONDecodeError:", e)

if __name__ == "__main__":
    test_home()
    test_save_pre_round_info()
    test_get_pre_round_info()
    test_chat()
