import { StarIcon } from 'lucide-react';
import IconButton from '../IconButton';
import { useStore } from '../../store';
import { useShallow } from 'zustand/react/shallow';

interface IWeatherHero {
  city: string;
  temperature: string;
  icon: string;
}

export default function WeatherHero({ city, temperature, icon }: IWeatherHero) {
  const { favorites, addFavorite, removeFavorite } = useStore(
    useShallow((s) => ({
      favorites: s.favorites,
      addFavorite: s.addFavorite,
      removeFavorite: s.removeFavorite,
    }))
  );

  const handleFavoriteToggle = (city: string) => {
    const isFavorite = favorites.includes(city);

    if (isFavorite) {
      removeFavorite(city);
    } else {
      addFavorite(city);
    }
  };

  const isFavorite = favorites.includes(city);

  return (
    <div className="flex w-full min-h-[150px] justify-between">
      <div className="flex flex-col justify-between">
        <h3 className="text-4xl font-semibold text-foreground">{city}</h3>
        <div className="flex items-center gap-3">
          <h1 className="text-6xl font-semibold text-foreground">
            {temperature}°C
          </h1>
          <IconButton
            icon={StarIcon}
            onAction={() => handleFavoriteToggle(city)}
            className="hover:bg-yellow-50 bg-white"
            iconClassName={
              isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-subtle'
            }
          />
        </div>
      </div>
      <img src={icon} alt={`${city}-weather-icon`} className="w-36" />
    </div>
  );
}
