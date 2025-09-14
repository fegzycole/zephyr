import { useState, useMemo } from 'react';
import { useWeatherRealTime } from '../../api/data-hooks/weather';
import { useStore } from '../../store';
import { HomePageSkeleton } from './HomePageSkeleton';
import { useShallow } from 'zustand/react/shallow';
import Cities from '../../components/Cities';
import SearchBar from '../../components/SearchBar';
import LoadMorePagination from '../../components/LoadMorePagination';

export default function HomePage() {
  const { favorites, cities } = useStore(
    useShallow((s) => ({
      cities: s.cities,
      favorites: s.favorites,
    }))
  );

  const [city, setCity] = useState('');

  const allCities = useMemo(() => {
    if (city) return [city];
    return [
      ...[...new Set(favorites)].sort(),
      ...[...new Set(cities.filter((c) => !favorites.includes(c)))].sort(),
    ];
  }, [city, favorites, cities]);

  const { data, isLoading } = useWeatherRealTime({
    access_key: import.meta.env.VITE_WEATHER_API_KEY,
    query: allCities,
  });

  return (
    <div>
      <div className="mb-8">
        <SearchBar value={city} onChange={(e) => setCity(e.target.value)} />
      </div>

      <LoadMorePagination
        totalCount={allCities.length}
        initialCount={16}
        step={5}
      >
        {(visibleCount) => {
          const visibleData = data?.slice(0, visibleCount) || [];
          return isLoading ? (
            <HomePageSkeleton />
          ) : (
            <Cities data={visibleData} />
          );
        }}
      </LoadMorePagination>
    </div>
  );
}
