import { VisualCrossingApiResponse } from '../types/weather';

// Always use relative path (works for Vercel Dev and production)
const BASE_URL = ''; // no localhost:3000 here

const fetchVisualCrossingData = async (
  query: string,
  startDate: string,
  endDate: string
): Promise<VisualCrossingApiResponse | null> => {
  // Validate input
  if (!query.trim()) throw new Error('No city name found.');
  if (/[^a-zA-Z\s]/.test(query) || /\s{2,}/.test(query)) {
    throw new Error('Only letters and single spaces are allowed.');
  }

  // Encode query parameters to avoid 400 errors
  const encodedCity = encodeURIComponent(query);
  const encodedStart = encodeURIComponent(startDate);
  const encodedEnd = encodeURIComponent(endDate);

  // Use relative URL
  const url = `${BASE_URL}/api/visualcrossing?cityName=${encodedCity}&startDate=${encodedStart}&endDate=${encodedEnd}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      switch (response.status) {
        case 400:
          throw new Error('API key or city entered is invalid or missing.');
        case 401:
          throw new Error('Invalid API key entered.');
        case 404:
          throw new Error(`No info for "${query}".`);
        case 429:
          throw new Error('API monthly rate limit reached.');
        case 500:
          throw new Error('Internal server error.');
        default:
          throw new Error(`${response.status}`);
      }
    }

    const data: VisualCrossingApiResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Unable to fetch data. Check your connection.');
    } else if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('An unknown error occurred.');
    }
  }
};

export const getWeatherData = async (
  city: string,
  startDate: string,
  endDate: string
): Promise<VisualCrossingApiResponse | null> => {
  const data = await fetchVisualCrossingData(city, startDate, endDate);
  return data || null;
};
