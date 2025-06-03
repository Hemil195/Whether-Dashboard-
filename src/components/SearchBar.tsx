import { Loader2, MapPin, Search, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { searchLocations } from '../services/weatherService';
import { Location } from '../types';

interface SearchBarProps {
  onSelectLocation: (location: Location) => void;
  onGetCurrentLocation: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSelectLocation, onGetCurrentLocation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  useEffect(() => {
    const searchLocationsDebounced = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      
      setIsLoading(true);
      
      try {
        const locations = await searchLocations(query);
        setResults(locations);
        setIsOpen(locations.length > 0);
      } catch (error) {
        console.error('Error searching locations:', error);
        toast.error('Failed to search locations. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    const timer = setTimeout(searchLocationsDebounced, 500);
    
    return () => clearTimeout(timer);
  }, [query]);
  
  const handleSelectLocation = (location: Location) => {
    onSelectLocation(location);
    setQuery(location.name);
    setIsOpen(false);
  };
  
  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };
  
  return (
    <div className="relative" ref={searchRef}>
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Enter city name..."
          className="w-full p-3 pl-10 pr-10 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 shadow-inner focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
          <Search size={20} />
        </div>
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <X size={20} />}
          </button>
        )}
      </div>
      
      {isOpen && results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-slate-700 max-h-60 overflow-auto">
          <ul className="py-1">
            {results.map((location) => (
              <li 
                key={`${location.name}-${location.lat}-${location.lon}`}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                onClick={() => handleSelectLocation(location)}
              >
                <div className="flex items-center">
                  <div>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">
                      {location.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Lat: {location.lat.toFixed(2)}, Lon: {location.lon.toFixed(2)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;