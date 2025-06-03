import { WeatherData, ForecastData, Location} from '../types';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// Fetch current weather data
export const fetchWeatherData = async (
  location: Location,
  isMetric: boolean
): Promise<WeatherData> => {
  const units = isMetric ? 'metric' : 'imperial';

  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${location.lat}&lon=${location.lon}&units=${units}&appid=${API_KEY}`
    );
    if (!response.ok) throw new Error(`Weather API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data. Please try again.');
  }
};

// Fetch 5-day forecast data
export const fetchForecastData = async (
  location: Location,
  isMetric: boolean
): Promise<ForecastData> => {
  const units = isMetric ? 'metric' : 'imperial';

  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${location.lat}&lon=${location.lon}&units=${units}&appid=${API_KEY}`
    );
    if (!response.ok) throw new Error(`Forecast API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    throw new Error('Failed to fetch forecast data. Please try again.');
  }
};

// Search for locations by name
export const searchLocations = async (query: string): Promise<Location[]> => {
  try {
    const response = await fetch(
      `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
    );
    if (!response.ok) throw new Error(`Geocoding API error: ${response.status}`);

    const data = await response.json();
    return data.map((item: any) => ({
      name: `${item.name}${item.state ? `, ${item.state}` : ''}, ${item.country}`,
      lat: item.lat,
      lon: item.lon
    }));
  } catch (error) {
    console.error('Error searching locations:', error);
    throw new Error('Failed to search locations. Please try again.');
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
  return `${Math.round(convertedTemp * 10) / 10}°${unit === 'celsius' ? 'F' : 'C'}`;
};