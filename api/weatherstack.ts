// /api/weatherstack.ts
import { fetchWeatherStackData } from '../backend/server/src/controllers/apiHelpers.js';

export default async function handler(req: any, res: any) {
  try {
    const city = (req.query.city as string)?.trim();

    if (!city) {
      return res.status(400).json({ error: 'Missing or empty city parameter' });
    }

    // Encode to handle spaces, special characters
    const encodedCity = encodeURIComponent(city);

    const data = await fetchWeatherStackData(encodedCity);

    res.status(200).json(data);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message || 'Unknown error' });
  }
}
