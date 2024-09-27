from flask import Flask, jsonify, request
import requests 
from dotenv import load_dotenv 
import os
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for the entire app

# Load environment variables from .env file
load_dotenv()

API_KEY = os.getenv('OPENWEATHER_API_KEY')

def fetch_weather_data(city):
    """Helper function to fetch weather data from OpenWeather API."""
    url = f'https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric'
    response = requests.get(url)
    
    if response.status_code != 200:
        return None, response.status_code  # Return None and the status code if the request fails
    return response.json(), 200

@app.route('/')
def home():
    return jsonify({"message": "Please use /api/weather?city=<city_name> to get weather data."})

@app.route('/favicon.ico')
def favicon():
    return '', 204  # Responding with no content

@app.route('/api/weather', methods=['GET'])
def get_weather():
    # Get the city or lat/long coordinates from request
    city = request.args.get('city')
    

    if city:
        r = requests.get(f'https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}')
        json_object = r.json()

        # Extract weather data
        if r.status_code == 200:
            temperature = int(json_object['main']['temp'] - 273.15)  # Convert from Kelvin to Celsius
            humidity = json_object['main']['humidity']
            pressure = json_object['main']['pressure']
            wind_speed = json_object['wind']['speed']
            condition = json_object['weather'][0]['main']
            description = json_object['weather'][0]['description']

            # Return the data as JSON
            return jsonify({
                'city': city,
                'temperature': temperature,
                'humidity': humidity,
                'pressure': pressure,
                'wind_speed': wind_speed,
                'condition': condition,
                'description': description
            })
        else:
            return jsonify({'error': 'City not found'}), 404
    else:
        return jsonify({'error': 'No city provided'}), 400



if __name__ == '__main__':
    app.run(debug=True)
