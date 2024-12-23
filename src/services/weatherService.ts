import { WeatherData, WeatherStackAPIResponse } from '../types/weather';

const API_KEY = import.meta.env.VITE_WEATHERSTACK_API_KEY;
const BASE_URL = 'https://api.weatherstack.com/current';
const MOCK_DATA_URL = '/mockWeatherData.json';

const fetchWeatherData = async (query: string): Promise<WeatherStackAPIResponse | null> => {
  // Force using mock data URL for development
  const useMockData = true; // Set this to true to use mock data

  if (!API_KEY && !useMockData) {
    throw new Error('API access key not found.');
  } 

  if (!query.trim()) {
    throw new Error('No city name found, please try again.');
  }

  if (/[^a-zA-Z\s]/.test(query) || /\s{2,}/.test(query)) {
    throw new Error('Only letters and single spaces are allowed.');
  }

  const url = useMockData ? MOCK_DATA_URL : `${BASE_URL}?access_key=${API_KEY}&query=${query}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: WeatherStackAPIResponse = await response.json();

    if (data.success === false) {
      // Known errors from the WeatherStack API
      switch (data.error.code) {
        case 101:
          throw new Error('Invalid API access key used.');
        case 601:
          throw new Error('Invalid city entered.');
        case 404:
          throw new Error('Invalid location.');
        case 104:
          throw new Error('API monthly rate limit reached. Please try again next month.');
        default:
          console.log(data.error);
          throw new Error('Request failed, please try again...');
      }
    }

    // Check if the city name in the response matches the query
    const normalizedQuery = query.toLowerCase().trim();
    const normalizedCityName = data.location.name.toLowerCase().trim();
    
    // Allow small variations of query entered by the user
    if (!normalizedCityName.includes(normalizedQuery)) {
      throw new Error(`😲 Whoops! ${query} doesn't match weather data. Please check your spelling or try a different city name 😁`);
    }

    return data;  

  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Unable to fetch data. Please check your connection.');
    } else if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('An unknown error occurred.');
    }
  }
};

export const getCurrentWeather = async (city: string): Promise<WeatherData | null> => {
  const data = await fetchWeatherData(city);

  if (!data || !data.request || !data.location || !data.current) {
    return null; 
  }

  const { request, location, current } = data;

  return {
    request,
    location,
    current,
  };
};