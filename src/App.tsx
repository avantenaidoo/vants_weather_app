import { useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import SearchBar from './components/SearchBar';
import useWeatherData from './hooks/useWeatherData'; 
import './styles/components/a11y.css';

const App = () => {
  
  const [city, setCity] = useState<string>(''); 

  const { weatherData, loading, errorMessage } = useWeatherData(city);

  const handleSearch = (city: string) => {

    setCity(city); 
  };

  return (
    <div className="app-container">
      <h1 className="offscreen">Responsive Weather App</h1>

      {/* Pass handleSearch function and loading state to SearchBar */}
      <SearchBar onSearch={handleSearch} loading={loading} />

      {/* Show weather data in CurrentWeather */}
      <CurrentWeather weatherData={weatherData} errorMessage={errorMessage} />
    </div>
  );
};

export default App;
