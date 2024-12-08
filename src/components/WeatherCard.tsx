import React from 'react';

type WeatherCardProps = {
  date: string;
  temperature: number;
  description: string;
  icon: string;
  onClick: () => void;
};

const WeatherCard = ({ date, temperature, description, icon, onClick }: WeatherCardProps) => {
  return (
    <div className="weather-card" onClick={onClick}>
      <h3>{date}</h3>
      <img src={icon} alt={description} />
      <p>{temperature}°C</p>
      <p>{description}</p>
    </div>
  );
};

export default WeatherCard;