import requests
import time

# Define the base URL and endpoints to test
base_url = 'http://localhost:3000'
endpoints = ['/parks', '/events', '/spots']

def test_endpoint(endpoint):
    url = f"{base_url}{endpoint}"
    start_time = time.time() 
    try:
        response = requests.get(url)
        elapsed_time = time.time() - start_time 
        print(f"GET {endpoint} - Status Code: {response.status_code}, Response Time: {elapsed_time:.2f} seconds")
    except requests.RequestException as e:
        print(f"Error with {endpoint}: {e}")

for endpoint in endpoints:
    test_endpoint(endpoint)
