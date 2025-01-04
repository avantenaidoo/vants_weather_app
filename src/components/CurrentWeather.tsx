import { WeatherData } from '../types/weather';
import { formatDate } from '../utils/formatDate';
import '../styles/components/currentWeather.css';

type CurrentWeatherProps = {
  weatherData: WeatherData | null;
  error: Error | null;
};

const CurrentWeather = ({ weatherData, error }: CurrentWeatherProps) => {

  // const displayMessage = error?.message;


  if (error) {
    return (
      <div className="display-error bg-slate-50 bg-opacity-25 font-bold text-sm italic text-gray-950 text-center" role="alert" aria-labelledby="CurrentWeatherError">
        <p id="CurrentWeatherError">Error: {error.message}</p>
      </div>
    );
  }

  if (!weatherData) return null;


  const { location, current } = weatherData;
  const weatherIcon = current?.weather_icons?.[0];
  const weatherDescription = current?.weather_descriptions?.[0];
  const { name, country, localtime } = location || {}; 
  const { temperature, wind_speed, precip, pressure, humidity, feelslike } = current || {}; 

  const displayDate = formatDate(localtime);

  return (
    <div className={`current-display visible bg-slate-50 bg-opacity-25 p-3 rounded-xl shadow-lg max-w-lg mx-auto mb-3`} role="region" aria-labelledby="CurrentWeather">
      
      <h2 id="CurrentWeather" className="font-bold text-2xl text-center mb-6">{name}</h2>

      <div className="flex justify-center items-center space-x-11 mb-6">
        {/* Temperature */}
        <p className="temp-result text-6xl text-center">
          {temperature}°<span className="text-xl">C</span>
        </p>

        {/* Weather Icon */}
        {weatherIcon && (
          <img className="weather-icon object-contain" src={weatherIcon} alt={`Weather Icon showing ${weatherDescription}`} />
        )}
      </div>

      {/* Location */}
      <div className="text-center">
        <p className="text-lg">{country}</p>
        <p className="text-sm">{displayDate}</p>
      </div>

      {/* Weather Description and Other Details */}
      <div className="text-center font-normal mt-4">
        <p className="text-lg font-bold">{weatherDescription}</p>
        <p>Wind: {wind_speed} km/h</p>
        <p>Precipitation: {precip} mm</p>
        <p>Pressure: {pressure} mb</p>
        <p>Humidity: {humidity}%</p>
        <p>Feels Like: {feelslike}°C</p>
      </div>
    </div>
  );
};

export default CurrentWeather;