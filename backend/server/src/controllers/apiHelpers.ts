// backend/server/src/controllers/apiHelpers.ts

import { config } from '../config/config.js';

// Pure function: fetch WeatherStack data
export const fetchWeatherStackData = async (city: string) => {
  if (!city.trim()) throw new Error('City name is required');

  // Encode city to handle spaces or special characters
  const cityEncoded = encodeURIComponent(city.trim());

  const response = await fetch(
    `${config.weatherStackUrl}?access_key=${config.weatherStackApiKey}&query=${cityEncoded}`
  );

  if (!response.ok) {
    throw new Error(`WeatherStack API returned status ${response.status}`);
  }

  const data = await response.json();
  return data;
};

// Pure function: fetch Visual Crossing data
export const fetchVisualCrossingData = async (
  cityName: string,
  startDate: string,
  endDate: string
) => {
  if (!cityName.trim() || !startDate || !endDate) {
    throw new Error('City name and start/end dates are required');
  }

  // Encode parameters to prevent 400 errors
  const cityEncoded = encodeURIComponent(cityName.trim());
  const startEncoded = encodeURIComponent(startDate);
  const endEncoded = encodeURIComponent(endDate);

  const response = await fetch(
    `${config.visualCrossingUrl}/${cityEncoded}/${startEncoded}/${endEncoded}?unitGroup=metric&include=days,current&key=${config.visualCrossingApiKey}`
  );

  if (!response.ok) {
    throw new Error(`Visual Crossing API returned status ${response.status}`);
  }

  const data = await response.json();
  return data;
};
