import { useState, useEffect } from 'react';
import { getCurrentWeather } from '../services/weatherService';
import { WeatherData } from '../types/weather';

const useWeatherData = (city: string) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<Error | null>(null);

  useEffect(() => {
    // If city is not provided, do not fetch weather data
    if (!city) return;
    setWeatherData(null);

    const getWeatherData = async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        console.log('Fetching weather for city:', city);
        const data = await getCurrentWeather(city); // Fetch weather data
        setWeatherData(data); 
        
      } catch (error) {
        if (error instanceof Error) {
          console.log('Caught error:', error);
          setErrorMessage(error); // Set specific error if it's a known Error type
        } else {
          console.log('Unknown error:', error);
          setErrorMessage(new Error('An unknown error occurred while fetching weather data.')); // Generic error handling
        }
      } finally {
        setLoading(false); // Set loading to false after the request is complete
      }
    };

    getWeatherData(); // Call the function to fetch weather data

  }, [city]); // Only re-fetch when the city changes and it's not an empty string

  return { weatherData, loading, errorMessage };
};

export default useWeatherData;
