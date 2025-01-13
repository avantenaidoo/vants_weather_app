import 'dotenv/config';

export const config = {
    port: process.env.PORT || 3000,
    weathStackUrl: process.env.WEATHERSTACK_URL,
    weatherStackApiKey: process.env.WEATHERSTACK_API_KEY,
    visualCrossingUrl: process.env.VISUALCROSSING_URL,
    visualCrossingApiKey: process.env.VISUALCROSSING_API_KEY
};