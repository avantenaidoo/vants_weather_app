import { WeatherData, WeatherStackAPIResponse } from '../types/weather';

// Always use relative path (works for Vercel Dev and production)
const BASE_URL = ''; // No localhost:3000 here

const fetchWeatherData = async (query: string): Promise<WeatherStackAPIResponse | null> => {
  if (!query.trim()) throw new Error('No city name found, please try again.');
  if (/[^a-zA-Z\s]/.test(query) || /\s{2,}/.test(query)) {
    throw new Error('Only letters and single spaces are allowed.');
  }

  const url = `${BASE_URL}/api/weatherstack?city=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: WeatherStackAPIResponse = await response.json();

    if (data.success === false) {
      switch (data.error.code) {
        case 101:
          throw new Error('Invalid API access key used.');
        case 601:
          throw new Error('Invalid city entered.');
        case 404:
          throw new Error('Invalid location.');
        case 104:
          throw new Error('WeatherStack API monthly rate limit reached. Please try again next month.');
        default:
          throw new Error(`No data for "${query}".`);
      }
    }

    const normalizedQuery = query.toLowerCase().trim();
    const normalizedCityName = data.location.name.toLowerCase().trim();
    const normalizedCountryName = data.location.country.toLowerCase().trim();

    if (
      normalizedCountryName === normalizedQuery ||
      normalizedCityName === normalizedQuery ||
      normalizedCityName.includes(normalizedQuery) ||
      normalizedCountryName.includes(normalizedQuery)
    ) {
      return data;
    }

    throw new Error(`No data for "${query}".`);
  } catch (error) {
    if (error instanceof TypeError) throw new Error('Unable to fetch data. Check your connection.');
    if (error instanceof Error) throw error;
    throw new Error('Unknown error occurred.');
  }
};

export const getCurrentWeather = async (city: string): Promise<WeatherData | null> => {
  const data = await fetchWeatherData(city);
  if (!data || !data.request || !data.location || !data.current) return null;

  const { request, location, current } = data;
  return { request, location, current };
};
