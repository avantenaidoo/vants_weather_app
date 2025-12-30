// /api/weatherstack.ts
import { fetchWeatherStackData } from './apiHelpers.js';

export default async function handler(req: any, res: any) {
  try {
    const city = (req.query.city as string)?.trim();
    if (!city) return res.status(400).json({ error: 'Missing or empty city parameter' });

    const data = await fetchWeatherStackData(city);
    res.status(200).json(data);
  } catch (err: any) {
    console.error('Server error in /api/weatherstack:', err);
    res.status(500).json({ error: err.message || 'Unknown server error' });
  }
}
