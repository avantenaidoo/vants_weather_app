export const getConfig = () => {
  if (!process.env.WEATHERSTACK_API_KEY) throw new Error("Missing WEATHERSTACK_API_KEY in environment variables");
  if (!process.env.WEATHERSTACK_URL) throw new Error("Missing WEATHERSTACK_URL in environment variables");
  if (!process.env.VISUALCROSSING_API_KEY) throw new Error("Missing VISUALCROSSING_API_KEY in environment variables");
  if (!process.env.VISUALCROSSING_URL) throw new Error("Missing VISUALCROSSING_URL in environment variables");

  return {
    port: process.env.PORT,
    backendUrl: process.env.BACKEND_URL,
    weatherStackUrl: process.env.WEATHERSTACK_URL,
    weatherStackApiKey: process.env.WEATHERSTACK_API_KEY,
    visualCrossingUrl: process.env.VISUALCROSSING_URL,
    visualCrossingApiKey: process.env.VISUALCROSSING_API_KEY,
  };
};
