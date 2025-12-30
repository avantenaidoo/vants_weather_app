// /api/apiHelpers.ts
import { getConfig } from './config.js';

const config = getConfig();

// Fetch WeatherStack data
export const fetchWeatherStackData = async (city: string) => {
  if (!city?.trim()) throw new Error("City name is required");

  const cityEncoded = encodeURIComponent(city.trim());
  const url = `${config.weatherStackUrl}?access_key=${config.weatherStackApiKey}&query=${cityEncoded}`;

  try {
    const response = await fetch(url);
    const text = await response.text();

    try {
      const data = JSON.parse(text);
      if (data.error) throw new Error(data.error.info || 'WeatherStack API returned an error');
      return data;
    } catch {
      console.error("Invalid JSON from WeatherStack:", text);
      throw new Error("Failed to parse WeatherStack API response");
    }
  } catch (err: any) {
    console.error("WeatherStack fetch error:", err);
    throw new Error(err.message || "Failed to fetch WeatherStack data");
  }
};

// Fetch Visual Crossing data
export const fetchVisualCrossingData = async (cityName: string, startDate: string, endDate: string) => {
  if (!cityName?.trim() || !startDate || !endDate) {
    throw new Error("City name and start/end dates are required");
  }

  const cityEncoded = encodeURIComponent(cityName.trim());
  const startEncoded = encodeURIComponent(startDate);
  const endEncoded = encodeURIComponent(endDate);

  const url = `${config.visualCrossingUrl}/${cityEncoded}/${startEncoded}/${endEncoded}?unitGroup=metric&include=days,current&key=${config.visualCrossingApiKey}`;

  try {
    const response = await fetch(url);
    const text = await response.text();

    try {
      const data = JSON.parse(text);
      if (data.error) throw new Error(data.error.message || 'Visual Crossing API returned an error');
      return data;
    } catch {
      console.error("Invalid JSON from Visual Crossing:", text);
      throw new Error("Failed to parse Visual Crossing API response");
    }
  } catch (err: any) {
    console.error("Visual Crossing fetch error:", err);
    throw new Error(err.message || "Failed to fetch Visual Crossing data");
  }
};
