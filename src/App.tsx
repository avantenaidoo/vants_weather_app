import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import WeatherGrid from './components/WeatherGrid';
import useWeather from './hooks/useWeather';

const App = () => {
  const { currentWeather, forecast, history, loading, error, fetchWeather } = useWeather();
  const [selectedDay, setSelectedDay] = useState(null);

  const handleSearch = (city: string) => {
    fetchWeather(city);
  };

  const handleDayClick = (date: string) => {
    const selected = [...forecast, ...history].find(day => day.date === date);
    setSelectedDay(selected || null);
  };

  return (
    <div className="app">
      <SearchBar onSearch={handleSearch} />
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {currentWeather && (
        <WeatherCard
          date={currentWeather.date}
          temperature={currentWeather.temperature}
          description={currentWeather.description}
          icon={currentWeather.icon}
          onClick={() => {}}
        />
      )}
      <WeatherGrid weatherData={[...forecast, ...history]} onDayClick={handleDayClick} />
      {selectedDay && (
        <div className="selected-day-details">
          <h2>Details for {selectedDay.date}</h2>
          <p>Temperature: {selectedDay.temperature}°C</p>
          <p>Description: {selectedDay.description}</p>
          <img src={selectedDay.icon} alt={selectedDay.description} />
        </div>
      )}
    </div>
  );
};

export default App;