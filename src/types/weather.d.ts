interface WeatherLocation {
    name: string;
}
  
interface CurrentWeather {
    temperature: number;
    weather_descriptions: string[];
    humidity: number;
    wind_speed: number;
}
  
interface WeatherData {
    location: WeatherLocation;
    current: CurrentWeather;
}
  