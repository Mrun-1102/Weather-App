import React, { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');

  // Function to fetch weather data from Flask API
  const getWeather = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/weather?city=${city}`);
      const data = await response.json();

      if (response.ok) {
        setWeatherData(data);
        setError('');
      } else {
        setWeatherData(null);
        setError(data.error);
      }
    } catch (err) {
      setError('An error occurred while fetching data.');
    }
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (city) {
      getWeather();
    } else {
      setError('Please enter a city name.');
    }
  };

  return (
    <div className="App">
      <h1>Real-Time Weather Dashboard</h1>

      {/* Input form for city */}
      <form onSubmit={handleSubmit} className="form-inline justify-content-center">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="form-control mb-2 mr-sm-2"
          placeholder="Enter city"
          required
        />
        <button type="submit" className="btn btn-primary mb-2">Get Weather</button>
      </form>

      {/* Display error if any */}
      {error && <div className="alert alert-danger text-center">{error}</div>}

      {/* Display weather data */}
      {weatherData && (
        <div>
          <h2 className="text-center">{weatherData.city}</h2>
          <p className="text-center">Condition: {weatherData.condition} - {weatherData.description}</p>
          <div className="row justify-content-center">
            <div className="col-md-4">
              <ul className="list-group">
                <li className="list-group-item">Temperature: {weatherData.temperature}°C</li>
                <li className="list-group-item">Humidity: {weatherData.humidity}%</li>
                <li className="list-group-item">Pressure: {weatherData.pressure} hPa</li>
                <li className="list-group-item">Wind Speed: {weatherData.wind_speed} m/s</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
