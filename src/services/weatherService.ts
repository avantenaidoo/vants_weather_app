

const API_KEY = import.meta.env.VITE_WEATHERSTACK_API_KEY;
const BASE_URL = 'http://api.weatherstack.com/';

const fetchWeatherData = async (endpoint: string, query: string) => {
  const url = `${BASE_URL}${endpoint}?access_key=${API_KEY}&query=${query}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }
  const data = await response.json();
  return data;
};

export const getCurrentWeather = async (city: string) => {
  const data = await fetchWeatherData('current', city);
  return data.current;
};

export const get3DayForecast = async (city: string) => {
  const data = await fetchWeatherData('forecast', city);
  return data.forecast;
};

export const get3DayHistory = async (city: string) => {
  const data = await fetchWeatherData('historical', city);
  return data.historical;
};