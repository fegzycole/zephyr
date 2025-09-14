import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetWeatherRealTime } from '@api/data-hooks/weather';
import WeatherDetailCard from '@components/WeatherDetailCard';
import WeatherHero from '@components/WeatherHero';
import NotesSection from '@components/NotesSection';
import { WeatherPageSkeleton } from './WeatherPageSkeleton';
import { deriveWeatherProperties } from '@api/data-hooks/weather/helpers/deriveWeatherProperties';
import NoWeatherData from '@components/NoWeatherData';

export default function WeatherPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const city = searchParams.get('city');

  useEffect(() => {
    if (!city) {
      setSearchParams({ city: 'Texas' }, { replace: true });
    }
  }, [city, setSearchParams]);

  const { isLoading, data } = useGetWeatherRealTime({
    query: city ?? '',
    access_key: import.meta.env.VITE_WEATHER_API_KEY,
  });

  if (!city) return null;
  if (isLoading) return <WeatherPageSkeleton />;
  if (!data) return <NoWeatherData />;

  const weatherProperties = deriveWeatherProperties(data);

  return (
    <div className="w-full xl:w-[50%] mx-auto">
      <div className="mb-10">
        <WeatherHero
          city={data.name}
          temperature={data.temperature}
          icon={data.icon}
        />

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
          {weatherProperties.map((property) => (
            <WeatherDetailCard {...property} key={property.label} />
          ))}
        </div>
      </div>
      <NotesSection city={city} />
    </div>
  );
}
