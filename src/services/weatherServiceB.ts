import { VisualCrossingApiResponse } from '../types/weather';

const API_KEY = import.meta.env.VITE_VISUALCROSSING_API_KEY;
const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

const fetchVisualCrossingData = async (query: string, startDate: string, endDate: string): Promise<VisualCrossingApiResponse | null> => {
  
  // Validate API key and query format
  if (!API_KEY) { 
    throw new Error('API access key not found.');
  } else if (!query.trim()) {
    throw new Error('No city name found, please try again.');
  } else if (/[^a-zA-Z\s]/.test(query) || /\s{2,}/.test(query)) {
    throw new Error('Only letters and single spaces are allowed.');
  }

  // Construct the API URL
  const url = `${BASE_URL}/${query}/${startDate}/${endDate}?unitGroup=metric&include=days,current&key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    
    // Check for response errors
    if (!response.ok) {
      switch (response.status) {
        case 400:
          throw new Error('API key or city entered is invalid or missing.');
        case 401:
          throw new Error('Invalid API key entered.');
        case 404:
          throw new Error(`😲 Whoops! There is no info for your search, "${query}". Please check your spelling or try a different city name 😁`);
        case 429:
          throw new Error('API monthly rate limit reached. Please try again next month.');
        case 500:
          throw new Error('Internal server error. Please try again later.');
        default:
          throw new Error(`${response.status}`);
      }
    }

    const data: VisualCrossingApiResponse = await response.json();

    return data;

  } catch (error) {
    // Handle network or other errors
    if (error instanceof TypeError) {
      throw new Error('Unable to fetch data. Please check your connection.');
    } else if (error instanceof Error) {
      throw error; // Rethrow known errors
    } else {
      throw new Error('An unknown error occurred.');
    }
  }
};

export const getWeatherData = async (city: string, startDate: string, endDate: string): Promise<VisualCrossingApiResponse | null> => {
    const data = await fetchVisualCrossingData(city, startDate, endDate);

    if (!data) {
        return null;
    }

    // Log the data before returning
    // console.log('Returning Data:', data);

    return data;
};