import { WeatherData, ForecastData, Location, AirQualityData } from '../types';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';
const AIR_QUALITY_URL = 'https://api.openweathermap.org/data/2.5/air_pollution';

// Helper function to check API key
const checkApiKey = () => {
  if (!API_KEY) {
    throw new Error('OpenWeatherMap API key is not configured. Please add VITE_OPENWEATHER_API_KEY to your environment variables.');
  }
};

// Fetch current weather data
export const fetchWeatherData = async (
  location: Location,
  isMetric: boolean
): Promise<WeatherData> => {
  checkApiKey();
  const units = isMetric ? 'metric' : 'imperial';

  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${location.lat}&lon=${location.lon}&units=${units}&appid=${API_KEY}`
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(`Weather API error: ${response.status} - ${errorData?.message || response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

// Fetch 5-day forecast data
export const fetchForecastData = async (
  location: Location,
  isMetric: boolean
): Promise<ForecastData> => {
  checkApiKey();
  const units = isMetric ? 'metric' : 'imperial';

  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${location.lat}&lon=${location.lon}&units=${units}&appid=${API_KEY}`
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(`Forecast API error: ${response.status} - ${errorData?.message || response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    throw error;
  }
};

// Search for locations by name
export const searchLocations = async (query: string): Promise<Location[]> => {
  checkApiKey();
  try {
    const response = await fetch(
      `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(`Geocoding API error: ${response.status} - ${errorData?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.map((item: any) => ({
      name: `${item.name}${item.state ? `, ${item.state}` : ''}, ${item.country}`,
      lat: item.lat,
      lon: item.lon
    }));
  } catch (error) {
    console.error('Error searching locations:', error);
    throw error;
  }
};

// Fetch air quality data
export const fetchAirQualityData = async (
  location: Location
): Promise<AirQualityData> => {
  checkApiKey();
  try {
    const response = await fetch(
      `${AIR_QUALITY_URL}?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}`
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(`Air Quality API error: ${response.status} - ${errorData?.message || response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching air quality data:', error);
    throw error;
  }
};

export const convertTemperature = (celsius: number, unit: 'celsius' | 'fahrenheit'): number => {
  if (unit === 'fahrenheit') {
    return (celsius * 9/5) + 32;
  }
  return celsius;
};

export const formatTemperature = (temp: number, unit: 'celsius' | 'fahrenheit'): string => {
  const convertedTemp = convertTemperature(temp, unit);
  return `${Math.round(convertedTemp * 10) / 10}°${unit === 'celsius' ? 'C' : 'F'}`;
};

// Helper function to get wind direction
export const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

// Helper function to get weather description
export const getWeatherDescription = (weather: WeatherData): string => {
  return weather.weather[0].description.charAt(0).toUpperCase() + 
         weather.weather[0].description.slice(1);
};