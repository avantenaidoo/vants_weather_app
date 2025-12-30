// /api/visualcrossing.ts
import { fetchVisualCrossingData } from './apiHelpers.ts';

export default async function handler(req: any, res: any) {
  try {
    const cityName = (req.query.cityName as string)?.trim();
    const startDate = (req.query.startDate as string)?.trim();
    const endDate = (req.query.endDate as string)?.trim();

    if (!cityName || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing cityName, startDate, or endDate parameter' });
    }

    // Do NOT encode here — the helper already handles encoding
    const data = await fetchVisualCrossingData(cityName, startDate, endDate);

    res.status(200).json(data);
  } catch (err: any) {
    console.error('Server error in /api/visualcrossing:', err);
    res.status(500).json({ error: err.message || 'Unknown server error' });
  }
}
