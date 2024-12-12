import React, { useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import SearchBar from './components/SearchBar';
import WeatherGrid from './components/WeatherGrid';
import './styles/components/a11y.css';

const App = () => {
  const [city, setCity] = useState('');

  const handleSearch = (city: string) => {
    setCity(city);
  };

  return (
    <div className="app-container">
      <h1 className='offscreen'>Responsive Weather App</h1>
      <SearchBar onSearch={handleSearch} />
      <a href="#CurrentWeather" className='skip-link'>Skip to Current Conditions</a>
      <CurrentWeather city={city}/>
      <WeatherGrid />
      <p id='confirmation' className='hidden' aria-live='assertive'></p>
    </div>
  );
};

export default App;