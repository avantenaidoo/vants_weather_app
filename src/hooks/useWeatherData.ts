import { useState, useEffect } from 'react';
import { getCurrentWeather } from '../services/weatherService';
import { WeatherData } from '../types/weather';

const useWeatherData = (city: string) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getWeatherData = async () => {
      try {
        const data = await getCurrentWeather(city);
        setWeatherData(data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    getWeatherData();
  }, [city]);

  return { weatherData, loading, error };
};

export default useWeatherData;