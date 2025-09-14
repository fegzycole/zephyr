import { WeatherHeroSkeleton } from '@components/WeatherHero';
import { WeatherDetailCardSkeleton } from '@components/WeatherDetailCard';
import { NoteSectionSkeleton } from '@components/NotesSection/NoteSectionSkeleton';

export function WeatherPageSkeleton() {
  return (
    <div className="w-full xl:w-[50%] mx-auto">
      <div className="mb-10">
        <WeatherHeroSkeleton />
      </div>
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
        {Array.from({ length: 6 }).map((_, idx) => (
          <WeatherDetailCardSkeleton key={idx} />
        ))}
      </div>
      <div className="mt-5">
        <NoteSectionSkeleton />
      </div>
    </div>
  );
}
