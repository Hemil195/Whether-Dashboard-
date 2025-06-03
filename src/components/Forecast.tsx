import React from 'react';
import { ForecastData } from '../types';
import WeatherIcon from './WeatherIcon';

interface ForecastProps {
  forecast: ForecastData;
  isMetric: boolean;
}

const Forecast: React.FC<ForecastProps> = ({ forecast, isMetric }) => {
  // Group forecast data by day
  const groupedForecast = forecast.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const formattedDate = `${dayOfWeek}, ${monthDay}`;
    
    // Use formattedDate as the key
    if (!acc[formattedDate]) {
      acc[formattedDate] = {
        date: formattedDate,
        originalDate: date, // Store original date for comparison
        timestamps: [],
        minTemp: item.main.temp_min,
        maxTemp: item.main.temp_max,
        icon: item.weather[0].main,
        description: item.weather[0].description // Keep description in case needed
      };
    }
    
    acc[formattedDate].timestamps.push(item);
    acc[formattedDate].minTemp = Math.min(acc[formattedDate].minTemp, item.main.temp_min);
    acc[formattedDate].maxTemp = Math.max(acc[formattedDate].maxTemp, item.main.temp_max);
    
    return acc;
  }, {} as Record<string, any>);
  
  // Convert to array and limit to 5 days, sorting by original date
  const forecastDays = Object.values(groupedForecast)
    .sort((a, b) => a.originalDate.getTime() - b.originalDate.getTime())
    .slice(0, 5);

  // Get today's date for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="mt-0">
      {/* <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">5-Day Forecast</h3> */}
      
      <div className="grid grid-cols-5 gap-4">
        {forecastDays.map((day, index) => {
          // Determine if it's the current day more accurately
          const isToday = day.originalDate.toDateString() === today.toDateString();
          const displayDay = index === 0 ? 'Tomorrow' : day.date.split(', ')[0]; // Show 'Tomorrow' for the second day, short day for others
          const displayDate = day.date.split(', ')[1]; // Show Month Day

          return (
            <div 
              key={day.date}
              className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 transition-colors hover:shadow-md flex flex-col items-center text-gray-800 dark:text-gray-200"
            >
              <h4 className="font-medium text-sm">
                {displayDay}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">{displayDate}</p>
              
              <div className="my-2">
                {/* Using isToday ? true : false might be incorrect for isDay prop, assuming day icons are generally day icons */}
                <WeatherIcon condition={day.icon} size={40} isDay={true} animate={false} />
              </div>
              
              {/* <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-2">
                {day.description}
              </p> */}
              
              <p className="text-sm font-medium">
                <span className="text-red-600 dark:text-red-400">{Math.round(isMetric ? day.maxTemp : (day.maxTemp * 9/5) + 32)}°</span>
                {' / '}
                <span className="text-blue-600 dark:text-blue-400">{Math.round(isMetric ? day.minTemp : (day.minTemp * 9/5) + 32)}°</span>
                {/* <span className="ml-1 text-sm">{isMetric ? 'C' : 'F'}</span> */}
              </p>
            </div>
          );
        })}
      </div>
      
      {/* Remove Hourly Forecast Section */}
      {/* <div className="mt-8 overflow-x-auto pb-2">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Hourly Forecast</h3>
        <div className="flex space-x-4 min-w-max">
          {forecast.list.slice(0, 8).map((item) => {
            const time = new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            return (
              <div 
                key={item.dt}
                className="p-3 min-w-24 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 flex flex-col items-center"
              >
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{time}</p>
                <div className="my-2">
                  <WeatherIcon 
                    condition={item.weather[0].main} 
                    size={32} 
                    isDay={true} 
                    animate={false} 
                  />
                </div>
                <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  {Math.round(item.main.temp)}°<span className="ml-1 text-sm">{isMetric ? 'F' : 'C'}</span>
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {Math.round(item.wind.speed)} {isMetric ? 'm/s' : 'mph'}
                </p>
              </div>
            );
          })}
        </div>
      </div> */}
    </div>
  );
};

export default Forecast;