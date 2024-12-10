import React from 'react';
import useWeatherData from '../hooks/useWeatherData';

interface CurrentWeatherProps {
  city: string;
}

const CurrentWeather = ({ city }: CurrentWeatherProps) => {
  const { weatherData, loading, error } = useWeatherData(city);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!weatherData) return <p>No weather data available.</p>;

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <div className="flex items-center">
        <img src={weatherData.weather_icons[0]} alt="Weather Icon" className="w-16 h-16 mr-4" />
        <div>
          <h3 className="text-2xl font-bold">{weatherData.location.name}</h3>
          <p className="text-lg">{weatherData.weather_descriptions[0]}</p>
          <p className="text-4xl font-bold">{weatherData.temperature}°C</p>
          <p>Wind: {weatherData.wind_speed} km/h</p>
          <p>Precipitation: {weatherData.precip} mm</p>
          <p>Pressure: {weatherData.pressure} mb</p>
          <p>Local Time: {weatherData.location.localtime}</p>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;