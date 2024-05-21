import requests
import json
import datetime

my_api_key = "562e4d174454e09b73641aa20a5c0bed"
api_url = f"https://api.stlouisfed.org/fred/series/categories?series_id=EXJPUS&api_key={my_api_key}&file_type=json"

# GET request to the API
response = requests.get(api_url)

# Checking the response status and print data
if response.status_code == 200:
    print("Successfully retrieved data!")
    data = response.json()
    print(json.dumps(data, indent=4))
else:
    print("Failed to retrieve data. Status code:", response.status_code)
    print("Response message:", response.text)
























