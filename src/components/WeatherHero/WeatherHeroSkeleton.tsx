import Skeleton from '../Skeleton';

export function WeatherHeroSkeleton() {
  return (
    <div className="bg-gray-200 rounded-2xl p-5 flex justify-between w-full">
      <div className="flex flex-col justify-between">
        <Skeleton dataTestId="skeleton-title" className="h-8 w-48" />
        <Skeleton dataTestId="skeleton-temperature" className="h-10 w-20" />
      </div>
      <Skeleton dataTestId="skeleton-icon" className="size-28" />
    </div>
  );
}
