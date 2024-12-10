import React, { useState } from 'react';
import CurrentWeather from './components/CurrentWeather';

const App = () => {
  const [city, setCity] = useState('New York');

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="app-container">
      <h1>Weather App</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="city-input">Enter city name:</label>
        <input
          type="text"
          id="city-input"
          value={city}
          onChange={handleCityChange}
          placeholder="Enter city name"
          className="city-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>
      <CurrentWeather city={city} />
    </div>
  );
};

export default App;