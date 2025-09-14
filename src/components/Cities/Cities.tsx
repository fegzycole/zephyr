import { useShallow } from 'zustand/react/shallow';
import { ITransformedWeatherRealTimeDetails } from '@api/data-hooks/weather/types';
import { useStore } from '@store';
import { WeatherCard } from '@components/WeatherCard';

interface ICities {
  data: (ITransformedWeatherRealTimeDetails | undefined)[];
}

export default function Cities({ data }: ICities) {
  const { removeCity, addFavorite, removeFavorite, favorites, cities } =
    useStore(
      useShallow((s) => ({
        cities: s.cities,
        removeCity: s.removeCity,
        addFavorite: s.addFavorite,
        removeFavorite: s.removeFavorite,
        favorites: s.favorites,
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

  const handleRemoveCity = (city: string) => {
    removeCity(city);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
      {data.map((d) => {
        if (!d) return <></>;

        const isFavorite = favorites.includes(d.name);

        const isSavedCity = cities.includes(d.name);

        return (
          <WeatherCard
            key={d.name}
            city={d.name}
            time={d.time}
            temp={d.temperature}
            icon={d.icon}
            isFavorite={isFavorite}
            canDelete={isSavedCity}
            onFavoriteToggle={() => handleFavoriteToggle(d.name)}
            onRemoveCity={() => handleRemoveCity(d.name)}
          />
        );
      })}
    </div>
  );
}
