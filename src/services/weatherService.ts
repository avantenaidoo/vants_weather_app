import { WeatherData, WeatherStackAPIResponse } from '../types/weather';

const API_KEY = import.meta.env.VITE_WEATHERSTACK_API_KEY;
const BASE_URL = 'https://api.weatherstack.com/current';

const fetchWeatherData = async (query: string): Promise<WeatherStackAPIResponse | null> => {
  if (!API_KEY || !query) {
    throw new Error('API access key not found.');
  }

  const url = `${BASE_URL}?access_key=${API_KEY}&query=${query}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      //console.log(response.status);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: WeatherStackAPIResponse = await response.json();

    if (data.success === false) {
      //Known errors from the API
      if (data.error.code === 101) throw new Error('Invalid API access key used.');
      if (data.error.code === 601) throw new Error('Invalid city entered.');
      if (data.error.code === 404) throw new Error('Invalid location.');
      if (data.error.code === 429) throw new Error('API monthly rate limit reached. Please try again next month.')
      throw new Error(`Request failed please try later...`);
    }

    return data;  

  } catch (error) {
    if (error instanceof TypeError) {
      
      throw new Error('Unable to fetch data. Please check your connection.');
    } else {

      throw error;  
    }
  } finally {
    //console.log('Fetch attempt completed'); 
  }
};

export const getCurrentWeather = async (city: string): Promise<WeatherData | null> => {
  try {
    const data = await fetchWeatherData(city);

    if (!data || !data.request || !data.location || !data.current ) {

      return null; 
    }

    const { request, location, current } = data;

    return {
      request,
      location,
      current,
    };
  } catch (error) {
    console.log('Unable to get weather data.', error);

    throw error;
  } finally {
    //console.log('Weather fetch attempt completed');
  }
};
