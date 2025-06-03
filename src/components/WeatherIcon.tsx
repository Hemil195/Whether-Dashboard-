import React from 'react';
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudFog,
  CloudLightning,
  CloudDrizzle,
  Moon,
  CloudMoon
} from 'lucide-react';

interface WeatherIconProps {
  condition: string;
  size: number;
  isDay: boolean;
  animate: boolean;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({
  condition,
  size,
  isDay,
  animate
}) => {
  const getIconByCondition = () => {
    const lowerCondition = condition.toLowerCase();
    
    if (lowerCondition.includes('clear')) {
      return isDay ? (
        <Sun size={size} className={`text-yellow-400 ${animate ? 'animate-pulse-slow' : ''}`} />
      ) : (
        <Moon size={size} className={`text-gray-200 ${animate ? 'animate-pulse-slow' : ''}`} />
      );
    } else if (lowerCondition.includes('cloud') && !lowerCondition.includes('rain')) {
      return isDay ? (
        <Cloud size={size} className="text-gray-400" />
      ) : (
        <CloudMoon size={size} className="text-gray-400" />
      );
    } else if (lowerCondition.includes('rain') || lowerCondition.includes('shower')) {
      return (
        <CloudRain 
          size={size} 
          className={`text-blue-400 ${animate ? 'animate-bounce-gentle' : ''}`} 
        />
      );
    } else if (lowerCondition.includes('drizzle')) {
      return (
        <CloudDrizzle 
          size={size} 
          className={`text-blue-300 ${animate ? 'animate-bounce-gentle' : ''}`} 
        />
      );
    } else if (lowerCondition.includes('snow')) {
      return (
        <CloudSnow 
          size={size} 
          className={`text-blue-100 ${animate ? 'animate-fall-slow' : ''}`} 
        />
      );
    } else if (lowerCondition.includes('thunder') || lowerCondition.includes('lightning')) {
      return (
        <CloudLightning 
          size={size} 
          className={`text-yellow-500 ${animate ? 'animate-flash' : ''}`} 
        />
      );
    } else if (lowerCondition.includes('fog') || lowerCondition.includes('mist') || lowerCondition.includes('haze')) {
      return <CloudFog size={size} className="text-gray-300" />;
    } else {
      // Default icon
      return isDay ? (
        <Sun size={size} className="text-yellow-400" />
      ) : (
        <Moon size={size} className="text-gray-200" />
      );
    }
  };
  
  return (
    <div className="weather-icon">
      {getIconByCondition()}
    </div>
  );
};

export default WeatherIcon;