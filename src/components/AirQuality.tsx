import React from 'react';
import { AirQualityData } from '../types';
import { Wind, Droplets, Cloud, Sun } from 'lucide-react';

interface AirQualityProps {
  data: AirQualityData;
}

const AirQuality: React.FC<AirQualityProps> = ({ data }) => {
  const getAQIDescription = (aqi: number): { text: string; color: string } => {
    switch (aqi) {
      case 1:
        return { text: 'Good', color: 'text-green-500' };
      case 2:
        return { text: 'Fair', color: 'text-yellow-500' };
      case 3:
        return { text: 'Moderate', color: 'text-orange-500' };
      case 4:
        return { text: 'Poor', color: 'text-red-500' };
      case 5:
        return { text: 'Very Poor', color: 'text-purple-500' };
      default:
        return { text: 'Unknown', color: 'text-gray-500' };
    }
  };

  const aqi = data.list[0].main.aqi;
  const { text, color } = getAQIDescription(aqi);
  const components = data.list[0].components;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Air Quality</h2>
      
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-800 dark:text-white">AQI</span>
          <span className={`text-xl font-semibold ${color}`}>{text}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div 
            className={`h-2.5 rounded-full ${color.replace('text', 'bg')}`}
            style={{ width: `${(aqi / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-lg bg-gray-50 dark:bg-slate-700">
          <div className="flex items-center mb-2">
            <Wind size={16} className="text-blue-500 mr-2" />
            <span className="text-sm text-gray-600 dark:text-gray-300">CO</span>
          </div>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            {components.co.toFixed(1)} μg/m³
          </p>
        </div>

        <div className="p-3 rounded-lg bg-gray-50 dark:bg-slate-700">
          <div className="flex items-center mb-2">
            <Droplets size={16} className="text-blue-500 mr-2" />
            <span className="text-sm text-gray-600 dark:text-gray-300">NO₂</span>
          </div>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            {components.no2.toFixed(1)} μg/m³
          </p>
        </div>

        <div className="p-3 rounded-lg bg-gray-50 dark:bg-slate-700">
          <div className="flex items-center mb-2">
            <Cloud size={16} className="text-blue-500 mr-2" />
            <span className="text-sm text-gray-600 dark:text-gray-300">PM2.5</span>
          </div>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            {components.pm2_5.toFixed(1)} μg/m³
          </p>
        </div>

        <div className="p-3 rounded-lg bg-gray-50 dark:bg-slate-700">
          <div className="flex items-center mb-2">
            <Sun size={16} className="text-blue-500 mr-2" />
            <span className="text-sm text-gray-600 dark:text-gray-300">O₃</span>
          </div>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            {components.o3.toFixed(1)} μg/m³
          </p>
        </div>
      </div>
    </div>
  );
};

export default AirQuality; 