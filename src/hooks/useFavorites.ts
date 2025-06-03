import { useState, useEffect } from 'react';
import { Location } from '../types';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Location[]>([]);
  
  useEffect(() => {
    const storedFavorites = localStorage.getItem('weatherFavorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error('Failed to parse favorites from localStorage:', error);
        // Reset if corrupted
        localStorage.removeItem('weatherFavorites');
      }
    }
  }, []);
  
  const saveFavoritesToStorage = (updatedFavorites: Location[]) => {
    localStorage.setItem('weatherFavorites', JSON.stringify(updatedFavorites));
  };
  
  const addFavorite = (location: Location) => {
    // Check if already exists to prevent duplicates
    if (!isFavorite(location)) {
      const updatedFavorites = [...favorites, location];
      setFavorites(updatedFavorites);
      saveFavoritesToStorage(updatedFavorites);
    }
  };
  
  const removeFavorite = (location: Location) => {
    const updatedFavorites = favorites.filter(
      fav => !(fav.name === location.name && 
               Math.abs(fav.lat - location.lat) < 0.01 && 
               Math.abs(fav.lon - location.lon) < 0.01)
    );
    setFavorites(updatedFavorites);
    saveFavoritesToStorage(updatedFavorites);
  };
  
  const isFavorite = (location: Location): boolean => {
    return favorites.some(
      fav => fav.name === location.name && 
             Math.abs(fav.lat - location.lat) < 0.01 && 
             Math.abs(fav.lon - location.lon) < 0.01
    );
  };
  
  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite
  };
};