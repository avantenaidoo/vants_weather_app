export interface WeatherData {
    temperature: number;
    wind_speed: number;
    precip: number;
    pressure: number;
    weather_icons: string[];
    weather_descriptions: string[];
    location: {
      name: string;
      country: string;
      region: string;
      localtime: string;
    };
    // Can add other relevant fields check API response
  }
  