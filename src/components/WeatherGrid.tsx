import React from 'react';
import WeatherCard from './WeatherCard';

type WeatherGridProps = {
  weatherData: Array<{
    date: string;
    temperature: number;
    description: string;
    icon: string;
  }>;
  onDayClick: (date: string) => void;
};

const WeatherGrid = ({ weatherData, onDayClick }: WeatherGridProps) => {
  return (
    <div className="weather-grid">
      {weatherData.map((day) => (
        <WeatherCard
          key={day.date}
          date={day.date}
          temperature={day.temperature}
          description={day.description}
          icon={day.icon}
          onClick={() => onDayClick(day.date)}
        />
      ))}
    </div>
  );
};

export default WeatherGrid;