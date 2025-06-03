import { useState, useEffect } from 'react';

interface GeolocationState {
  location: { lat: number; lon: number } | null;
  isGeoLoading: boolean;
  geoError: string | null;
  getLocation: () => void;
}

const useGeolocation = (): GeolocationState => {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [isGeoLoading, setIsGeoLoading] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  
  const getLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser');
      return;
    }
    
    setIsGeoLoading(true);
    setGeoError(null);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
        setIsGeoLoading(false);
      },
      (error) => {
        let errorMessage = 'Failed to get your location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access was denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        
        setGeoError(errorMessage);
        setIsGeoLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 600000 // 10 minutes
      }
    );
  };
  
  return {
    location,
    isGeoLoading,
    geoError,
    getLocation
  };
};

export default useGeolocation;