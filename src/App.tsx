import { useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import SearchBar from './components/SearchBar';
import useWeatherData from './hooks/useWeatherData'; 
import OfflineNotifier from './components/offlineNotifier';
import './styles/components/a11y.css';

const App = () => {
  
  const [city, setCity] = useState<string>(''); 

  const { weatherData, loading, error } = useWeatherData(city);

  const handleSearch = (city: string) => {

    setCity(city); 
  };

  return (
    <div className="app-container">
      <h1 className="offscreen">Responsive Weather App</h1>

      {/* Show offline component */}
      <OfflineNotifier />

      {/* Pass handleSearch function and loading state to SearchBar */}
      <SearchBar onSearch={handleSearch} loading={loading} />

      {/* Show weather data in CurrentWeather */}
      <CurrentWeather weatherData={weatherData} error={error} />
    </div>
  );
};

export default App;