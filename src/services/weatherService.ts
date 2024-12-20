import { WeatherData, WeatherStackAPIResponse } from '../types/weather';

const API_KEY = import.meta.env.VITE_WEATHERSTACK_API_KEY;
const BASE_URL = 'https://api.weatherstack.com/current';

const fetchWeatherData = async (query: string): Promise<WeatherStackAPIResponse | null> => {
  if (!API_KEY || !query) {
    throw new Error('API access key not found.')
  }

  const url = `${BASE_URL}?access_key=${API_KEY}&query=${query}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      console.log(response.status);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: WeatherStackAPIResponse = await response.json();

    if (data.success === false) {
      // Handle specific API errors
      if (data.error.code === 101) throw new Error('Invalid API access key.');
      if (data.error.code === 601) throw new Error('Invalid city entered.');
      if (data.error.code === 404) throw new Error('Invalid location.');
      if (data.error.code === 429) throw new Error('API monthly rate limit reached. Please try again next month.')
      throw new Error(`${data.error.info}`);
    }

    return data;  

  } catch (error) {
    if (error instanceof TypeError) {
      
      throw new Error('Unable to fetch data. Please check your connection.');
    } else {
      console.error('Error during fetch:', error);
      throw error;  
    }
  } finally {
    console.log('Fetch attempt completed');
  }
};

export const getCurrentWeather = async (city: string): Promise<WeatherData | null> => {
  try {
    const data = await fetchWeatherData(city);

    // If fetchWeatherData returns null, it indicates the fetch couldn't happen
    if (!data || !data.request || !data.location || !data.current ) {
      console.error('Weather data incomplete or missing.');
      return null; // Return early or show a message to the user
    }

    // Handle valid data here
    const { request, location, current } = data;
    console.log('Weather data:', { request, location, current });

    // Return the formatted weather data
    return {
      request,
      location,
      current,
    };
  } catch (error) {
    console.error('Error in getCurrentWeather:', error);
    // Handle unknown or unexpected errors, if needed
    throw error;
  } finally {
    console.log('Weather fetch attempt completed');
  }
};
