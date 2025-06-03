import React from 'react';
import { Star, Trash2, MapPin } from 'lucide-react';
import { Location } from '../types';

interface FavoritesProps {
  favorites: Location[];
  onSelectLocation: (location: Location) => void;
  onRemoveFavorite: (location: Location) => void;
  isFavorite: (location: Location) => boolean;
  onToggleFavorite: (location: Location) => void;
}

const Favorites: React.FC<FavoritesProps> = ({ 
  favorites, 
  onSelectLocation, 
  onRemoveFavorite,
  onToggleFavorite
}) => {
  if (favorites.length === 0) {
    return (
      <div className="p-0">
        <div className="text-center py-2">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Add locations to your favorites for quick access
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-0">
      <ul className="space-y-2">
        {favorites.map((location) => (
          <li 
            key={`${location.name}-${location.lat}-${location.lon}`}
            className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer group"
          >
            <div 
              className="flex-1 text-left text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors pr-4"
              onClick={() => onSelectLocation(location)}
            >
              <div className="flex items-center">
                 <MapPin size={16} className="mr-2 text-gray-400 dark:text-gray-500" />
                 <span>{location.name}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">{location.lat.toFixed(2)}, {location.lon.toFixed(2)}</p>
            </div>
            
            <button 
              onClick={(e) => { e.stopPropagation(); onRemoveFavorite(location); }}
              className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              aria-label={`Remove ${location.name} from favorites`}
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Favorites;