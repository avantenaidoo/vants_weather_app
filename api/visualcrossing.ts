// /api/visualcrossing.ts
import { fetchVisualCrossingData } from '../backend/server/src/controllers/apiHelpers.js';

export default async function handler(req: any, res: any) {
  try {
    const cityName = (req.query.cityName as string)?.trim();
    const startDate = (req.query.startDate as string)?.trim();
    const endDate = (req.query.endDate as string)?.trim();

    if (!cityName || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing one or more required query parameters' });
    }

    // Encode city to handle spaces/special characters
    const encodedCity = encodeURIComponent(cityName);

    const data = await fetchVisualCrossingData(encodedCity, startDate, endDate);

    res.status(200).json(data);
  } catch (err: any) {
    console.error(err); // Log backend errors
    res.status(400).json({ error: err.message || 'Unknown error' });
  }
}
