import { useState, useEffect } from 'react';
import { Location } from '../types';

const STORAGE_KEY = 'weatherRecentSearches';
const MAX_RECENT_SEARCHES = 5; // Limit the number of recent searches

export const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState<Location[]>([]);
  
  useEffect(() => {
    const storedSearches = localStorage.getItem(STORAGE_KEY);
    if (storedSearches) {
      try {
        setRecentSearches(JSON.parse(storedSearches));
      } catch (error) {
        console.error('Failed to parse recent searches from localStorage:', error);
        // Reset if corrupted
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);
  
  const saveSearchesToStorage = (updatedSearches: Location[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSearches));
  };
  
  const addRecentSearch = (location: Location) => {
    // Add the new search to the beginning of the list
    const updatedSearches = [location, ...recentSearches].slice(0, MAX_RECENT_SEARCHES);
    setRecentSearches(updatedSearches);
    saveSearchesToStorage(updatedSearches);
  };

  const removeRecentSearch = (location: Location) => {
    const updatedSearches = recentSearches.filter(
        search => !(search.name === location.name && 
                    Math.abs(search.lat - location.lat) < 0.01 && 
                    Math.abs(search.lon - location.lon) < 0.01)
    );
    setRecentSearches(updatedSearches);
    saveSearchesToStorage(updatedSearches);
  };

  const clearRecentSearches = () => {
      setRecentSearches([]);
      localStorage.removeItem(STORAGE_KEY);
  };
  
  return {
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches
  };
}; 