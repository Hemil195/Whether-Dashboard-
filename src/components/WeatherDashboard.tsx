import { MapPin, Moon, Sun, Cloud, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import useGeolocation from '../hooks/useGeolocation';
import { fetchForecastData, fetchWeatherData } from '../services/weatherService';
import { ForecastData, Location, WeatherData } from '../types';
import CurrentWeather from './CurrentWeather';
import Favorites from './Favorites';
import Forecast from './Forecast';
import SearchBar from './SearchBar';
import { useRecentSearches } from '../hooks/useRecentSearches';

const WeatherDashboard: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMetric, setIsMetric] = useState(true);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { location, isGeoLoading, geoError, getLocation } = useGeolocation();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { recentSearches, addRecentSearch } = useRecentSearches();

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    
    // Check if we have a previously searched location in localStorage
    const lastLocation = localStorage.getItem('lastLocation');
    if (lastLocation) {
      const parsedLocation = JSON.parse(lastLocation);
      fetchWeather(parsedLocation);
    } else {
      // Try to get user's location
      getLocation();
    }
  }, []);

  useEffect(() => {
    if (location) {
      fetchWeatherByCoords(location.lat, location.lon);
    }
  }, [location]);

  const fetchWeather = async (location: Location) => {
    setIsLoading(true);
    setError(null);
    
    console.log('Fetching weather for location:', location);

    try {
      const weather = await fetchWeatherData(location, isMetric);
      setWeatherData(weather);
      
      const forecast = await fetchForecastData(location, isMetric);
      setForecastData(forecast);
      
      // Save last searched location
      localStorage.setItem('lastLocation', JSON.stringify(location));
      // Add to recent searches
      addRecentSearch(location);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    fetchWeather({ name: 'Current Location', lat, lon });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleUnitSystem = () => {
    const newIsMetric = !isMetric;
    setIsMetric(newIsMetric);
    if (weatherData) {
      fetchWeather({ 
        name: weatherData.name, 
        lat: weatherData.coord.lat, 
        lon: weatherData.coord.lon 
      });
    }
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-7xl transition-colors duration-300 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <header className="lg:col-span-3 flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
            <Cloud size={24} className="mr-2 text-blue-500" />
            WeatherPro
          </h1>
          <div className="flex items-center gap-4">
             <button 
               onClick={toggleDarkMode} 
               className="p-2 rounded-full bg-blue-100 dark:bg-slate-700 text-blue-700 dark:text-blue-300 transition-colors"
             >
               {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
             </button>
             {/* Unit toggle button can be added back here if needed */}
             {/* <button  
               onClick={toggleUnitSystem} 
               className="px-3 py-1 rounded-full bg-blue-100 dark:bg-slate-700 text-blue-700 dark:text-blue-300 text-sm font-medium transition-colors"
             >
               {isMetric ? '°C' : '°F'}
             </button> */}
            <span className="text-sm text-gray-500 dark:text-gray-400">Real-time weather data</span>
          </div>
        </header>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Search Location</h2>
            <SearchBar onSelectLocation={fetchWeather} onGetCurrentLocation={getLocation} />
            <button 
              onClick={() => weatherData && fetchWeather({ name: weatherData.name, lat: weatherData.coord.lat, lon: weatherData.coord.lon })}
              className="mt-4 w-full py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Search size={20} />
              <span>Search Weather</span>
            </button>
            
            {isGeoLoading && !weatherData && (
              <div className="mt-4 text-center">
                <p>Detecting your location...</p>
              </div>
            )}
            
            {geoError && !weatherData && (
              <div className="mt-4 text-center text-red-500">
                <p>{geoError}</p>
                <p className="mt-2">Please search for a location manually.</p>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Favorites</h2>
            <Favorites 
              favorites={favorites} 
              isFavorite={isFavorite}
              onToggleFavorite={addFavorite}
              onRemoveFavorite={removeFavorite}
              onSelectLocation={fetchWeather}
            />
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Recent Searches</h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-300 text-sm">
              {/* Example Recent Search Items (replace with actual data handling) */}
              {recentSearches.map((location, index) => (
                <div 
                  key={`${location.name}-${location.lat}-${location.lon}-${index}`}
                  className="flex items-center justify-between cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  onClick={() => fetchWeather(location)}
                >
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                    <span>{location.name}</span>
                  </div>
                  {/* Optional: Add timestamp if available in recent searches data */}
                  {/* <span className="text-xs text-gray-500 dark:text-gray-400">Time ago</span> */}
                </div>
              ))}
              {recentSearches.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 text-sm">No recent searches</p>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-md p-8">
            {isLoading ? (
              <div className="mt-8 flex justify-center">
                <div className="animate-pulse rounded-lg bg-gray-200 dark:bg-slate-700 h-64 w-full"></div>
              </div>
            ) : error ? (
              <div className="mt-8 p-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-red-700 dark:text-red-400">{error}</p>
              </div>
            ) : weatherData && (
              <CurrentWeather 
                weather={weatherData} 
                isMetric={isMetric} 
                isFavorite={isFavorite({ 
                  name: weatherData.name, 
                  lat: weatherData.coord.lat, 
                  lon: weatherData.coord.lon 
                })}
                onToggleFavorite={() => {
                  const location = { 
                    name: weatherData.name, 
                    lat: weatherData.coord.lat, 
                    lon: weatherData.coord.lon 
                  };
                  
                  if (isFavorite(location)) {
                    removeFavorite(location);
                  } else {
                    addFavorite(location);
                  }
                }}
              />
            )}
          </div>

          {/* Forecast Section */}
          {forecastData && (
            <>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">5-Day Forecast</h2>
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
                <Forecast forecast={forecastData} isMetric={isMetric} />
              </div>
            </>
          )}

          {/* About Section */}
          {weatherData && weatherData.name !== 'Current Location' && (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 text-gray-700 dark:text-gray-300">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">About {weatherData.name}</h2>
              <div className="space-y-3">
                <p className="flex items-center text-sm">
                  <MapPin size={16} className="mr-2 text-blue-600 dark:text-blue-400" />
                  Coordinates: {weatherData.coord.lat.toFixed(2)}, {weatherData.coord.lon.toFixed(2)}
                </p>
                <p className="flex items-center text-sm">
                  <Sun size={16} className="mr-2 text-yellow-500 dark:text-yellow-400" />
                  Local time: {new Date(weatherData.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="flex items-center text-sm">
                  <Sun size={16} className="mr-2 text-orange-500 dark:text-orange-400" />
                  Sunrise: {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="flex items-center text-sm">
                  <Moon size={16} className="mr-2 text-blue-800 dark:text-blue-300" />
                  Sunset: {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )}
        </div>

        <footer className="lg:col-span-3 mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Weather data provided by OpenWeatherMap</p>
          <p className="mt-1">© {new Date().getFullYear()} Weather Dashboard</p>
        </footer>
      </div>
    </div>
  );
};

export default WeatherDashboard;