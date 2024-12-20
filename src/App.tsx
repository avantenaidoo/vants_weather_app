import { useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import SearchBar from './components/SearchBar';
import useWeatherData from './hooks/useWeatherData'; 
import './styles/components/a11y.css';

const App = () => {
  
  const [city, setCity] = useState<string>(''); 

  const { weatherData, loading, errorMessage } = useWeatherData(city);
  console.log('testing error ', errorMessage)

  const handleSearch = (city: string) => {
    console.log('City updated in App:', city);
    setCity(city); 
  };

  return (
    <div className="app-container">
      <h1 className="offscreen">Responsive Weather App</h1>

      {/* Pass handleSearch function and loading state to SearchBar */}
      <SearchBar onSearch={handleSearch} loading={loading} />

      {/* Skip link for accessibility not applicable till history and forcast ready
      <a href="#CurrentWeather" className="skip-link">
        Skip to Current Conditions
      </a> */}

      {/* Show weather data in CurrentWeather */}
      <CurrentWeather weatherData={weatherData} errorMessage={errorMessage} />
    </div>
  );
};

export default App;

// Forecast weather currently being developed