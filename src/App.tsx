import { useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import SearchBar from './components/SearchBar';
import WeatherGrid from './components/WeatherGrid';
import useWeatherData from './hooks/useWeatherData'; 
import { calculateDates } from './utils/calculateDates';
import useWeatherByDays from './hooks/useWeatherByDays';
import { Days } from './types/weather';
import OfflineNotifier from './components/OfflineNotifier';
import './styles/components/a11y.css';
import TileDisplay from './components/TileDisplay';
import ThemeToggle from './components/ThemeToggle';

const App = () => {
  
  const [city, setCity] = useState<string>(''); 
  const [tile, setTile] = useState<Days | null>(null);
  const [showTile, setShowTile] = useState<boolean>(false);
  

  const { weatherData, loading, error } = useWeatherData(city);

  // Extract city name from weatherData for Visual Crossing url endpoint
  const cityName = weatherData?.location.name || '';

  // Extract localtime from weatherData
  const localtime = weatherData?.location.localtime || '';

  // Calculate dates for Visual Crossing url endpoint
  const { startDate, endDate } = calculateDates(localtime);

  const { weatherDays } = useWeatherByDays(cityName, startDate, endDate);

  const handleSearch = (city: string) => {

    setCity(city); 
  };

  const handleTileClick = (day: Days) => {
    setTile(day);
    setShowTile(true);
  };

  const handleCloseTile = () => {
    setShowTile(false);
  };

  return (
    <div className="app-container">
      <h1 className="offscreen">Responsive Weather App</h1>

      {/* Show theme toggle */}
      <ThemeToggle />

      {/* Show offline component */}
      <OfflineNotifier />

      {/* Pass handleSearch function and loading state to SearchBar */}
      <SearchBar onSearch={handleSearch} loading={loading} />

      {/* Show weather data in CurrentWeather */}
      <CurrentWeather weatherData={weatherData} error={error} />

      {/* Pass weatherDays to WeatherGrid */}
      <WeatherGrid weatherDays={ weatherDays?.days || null } onTileClick={ handleTileClick }/>

      {/* Show selected tile in TileDisplay */}
      <TileDisplay tile={tile} onClose={handleCloseTile} showTile={showTile}/>     

      <div className="credits opacity-60">
        <p><a href="https://www.visualcrossing.com/weather-api" target="_blank" rel="noreferrer">Visual Crossing Weather API</a> &
        <a href="https://weatherstack.com" target='_blank' rel='noreferrer'>WeatherStack API</a></p>
      </div>
    </div>
  );
};

export default App;