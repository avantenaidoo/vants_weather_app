import { useState, useEffect } from 'react';
import { getCurrentWeather } from '../services/weatherService';
import { WeatherData } from '../types/weather';

const useWeatherData = (city: string) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<Error | null>(null);

  useEffect(() => {

    if (!city) return;
    setWeatherData(null);

    const getWeatherData = async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const data = await getCurrentWeather(city); 
        setWeatherData(data); 
        
      } catch (error) {
        if (error instanceof Error) {

          setErrorMessage(error); 
        } else {
          console.log('Unknown error:', error);
          setErrorMessage(new Error('An unknown error occurred while fetching weather data.')); // Generic error handling
        }
      } finally {
        setLoading(false); 
      }
    };

    getWeatherData(); 

  }, [city]); 

  return { weatherData, loading, errorMessage };
};

export default useWeatherData;
