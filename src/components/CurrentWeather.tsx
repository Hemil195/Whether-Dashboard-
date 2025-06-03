import { Droplets, Heart, Thermometer, Wind, MapPin, Sun, Eye, Cloud } from 'lucide-react';
import React from 'react';
import { WeatherData } from '../types';
import WeatherIcon from './WeatherIcon';

interface CurrentWeatherProps {
  weather: WeatherData;
  isMetric: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  weather,
  isMetric,
  isFavorite,
  onToggleFavorite
}) => {
  const getWeatherBackground = (condition: string, isDay: boolean) => {
    if (condition.includes('clear')) {
      return isDay
        ? 'from-blue-400 to-blue-600'
        : 'from-indigo-900 to-blue-900';
    } else if (condition.includes('cloud')) {
      return isDay
        ? 'from-blue-300 to-gray-400'
        : 'from-gray-700 to-gray-900';
    } else if (condition.includes('rain') || condition.includes('drizzle')) {
      return 'from-gray-400 to-gray-600';
    } else if (condition.includes('thunderstorm')) {
      return 'from-gray-700 to-gray-900';
    } else if (condition.includes('snow')) {
      return 'from-blue-100 to-gray-300';
    } else if (condition.includes('mist') || condition.includes('fog')) {
      return 'from-gray-300 to-gray-500';
    } else {
      return isDay
        ? 'from-blue-300 to-blue-500'
        : 'from-gray-700 to-gray-900';
    }
  };

  const isDay = weather.dt > weather.sys.sunrise && weather.dt < weather.sys.sunset;
  const weatherCondition = weather.weather[0].main.toLowerCase();
  const gradientClasses = getWeatherBackground(weatherCondition, isDay);

  const currentDate = new Date(weather.dt * 1000);
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString(undefined, options);
  const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-4 right-4">
        <button
          onClick={onToggleFavorite}
          className={`px-4 py-1 rounded-full border border-white/50 text-white text-sm transition-colors ${isFavorite ? 'bg-yellow-400 border-yellow-400 text-white' : 'hover:bg-white/20'}`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? '★ Saved' : '☆ Save'}
        </button>
      </div>

      <div>
        <div className="flex items-center text-lg mb-1">
            <MapPin size={20} className="mr-2" />
            <h2 className="font-bold">{weather.name}, {weather.sys.country}</h2>
        </div>
        <p className="text-sm opacity-90">{formattedDate}</p>
        <p className="text-sm opacity-90">Updated {formattedTime}</p>
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center">
          {/* Small Weather Icon on Left - Keep commented out as per image */}
          {/* <WeatherIcon
            condition={weather.weather[0].main}
            size={80}
            isDay={isDay}
            animate={true}
          /> */}
          <div className="">
            <span className="text-6xl font-bold">{Math.round(isMetric ? weather.main.temp : (weather.main.temp * 9/5) + 32)}°</span>
            <span className="text-xl ml-1">{isMetric ? 'Celsius' : 'Fahrenheit'}</span>
            <p className="text-lg opacity-90 mt-1">{weather.weather[0].description}</p>
            <p className="text-sm opacity-90 mt-1">
              Feels like {Math.round(isMetric ? weather.main.feels_like : (weather.main.feels_like * 9/5) + 32)}°{isMetric ? 'C' : 'F'}
            </p>
          </div>
        </div>
        {/* Large Weather Icon on Right */}
        <WeatherIcon
            condition={weather.weather[0].main}
            size={120}
            isDay={isDay}
            animate={true}
          />
      </div>

      {/* Cloudiness */}
      <div className="mt-6">
          <h3 className="text-sm font-semibold opacity-90">Cloudiness</h3>
          <div className="w-full bg-white/30 rounded-full h-2.5 mt-1">
            <div className="bg-white h-2.5 rounded-full" style={{ width: `${weather.clouds.all}%` }}></div>
          </div>
          <p className="text-xs opacity-90 text-right mt-1">{weather.clouds.all}%</p>
      </div>

      {/* Additional details grid */}
      <div className="mt-8 grid grid-cols-2 gap-4">
          {/* Wind Speed */}
          <div className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col items-center text-gray-800 dark:text-gray-200">
              <Wind size={20} className="opacity-80 text-blue-500 dark:text-blue-300" />
              <p className="mt-1 font-medium text-lg">
                {Math.round(isMetric ? weather.wind.speed : weather.wind.speed * 2.23694)} {isMetric ? 'm/s' : 'mph'}
              </p>
              <p className="text-xs opacity-75 text-gray-600 dark:text-gray-400">Wind Speed</p>
          </div>
          {/* Humidity */}
          <div className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col items-center text-gray-800 dark:text-gray-200">
              <Droplets size={20} className="opacity-80 text-blue-500 dark:text-blue-300" />
              <p className="mt-1 font-medium text-lg">{weather.main.humidity}%</p>
              <p className="text-xs opacity-75 text-gray-600 dark:text-gray-400">Relative humidity</p>
          </div>
          {/* Pressure */}
          <div className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col items-center text-gray-800 dark:text-gray-200">
              <Thermometer size={20} className="opacity-80 text-blue-500 dark:text-blue-300" />
              <p className="mt-1 font-medium text-lg">{weather.main.pressure} hPa</p>
              <p className="text-xs opacity-75 text-gray-600 dark:text-gray-400">Pressure</p>
          </div>
          {/* Visibility */}
          <div className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col items-center text-gray-800 dark:text-gray-200">
               <Eye size={20} className="opacity-80 text-blue-500 dark:text-blue-300" />
              <p className="mt-1 font-medium text-lg">{weather.visibility / 1000} km</p>
              <p className="text-xs opacity-75 text-gray-600 dark:text-gray-400">Visibility</p>
          </div>
      </div>
    </div>
  );
};

export default CurrentWeather;