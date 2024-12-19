import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import requests
import json
from time import sleep

# Read the CSV file
df = pd.read_csv('at1a23.csv')

# API configuration
API_URL = "http://localhost:3000/v1/indexes"
HEADERS = {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjgyZDk5YWJiYjlmYjM2MTQ1ZWJlZWQiLCJpYXQiOjE3MzM4MDgyODcsImV4cCI6MTczMzgxMDA4NywidHlwZSI6ImFjY2VzcyJ9.6LZVJDkIp8QE6B1_ZDY9hcwbTZoDPowHRmWYTXmiG8k",
    "Content-Type": "application/json"
}

def send_row_to_api(row):
    # Prepare the JSON payload
    payload = {
        "transformer": row['transformer'],
        "Hydrogen": row['Hydrogen (ppm)'],
        "Methane": row['Methane (ppm)'],
        "Acetylene": row['Acetylene (ppm)'],
        "Ethylene": row['Ethylene (ppm)'],
        "Ethane": row['Ethane (ppm)'],
        "CO2": row['Carbon Dioxide (ppm)'],
        "CO": row['Carbon Monoxide (ppm)'],
        "Water": row['Water (ppm)'],
        "TDCG": row['TDCG (ppm)'],
        "O2": row['Oxygen (ppm)']
    }
    
    try:
        response = requests.post(API_URL, headers=HEADERS, json=payload)
        response.raise_for_status()  # Raise an exception for bad status codes
        print(f"Successfully sent data for timestamp: {row['createdAt']}")
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error sending data for timestamp {row['createdAt']}: {str(e)}")
        return None

# Process each row
for index, row in df.iterrows():
    result = send_row_to_api(row)
    sleep(1)  # Add a 1-second delay between requests to avoid overwhelming the API
    
print("Data transmission completed!")

