import { WeatherCardSkeleton } from '@components/WeatherCard';

export function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <WeatherCardSkeleton key={idx} />
        ))}
      </div>
    </div>
  );
}
