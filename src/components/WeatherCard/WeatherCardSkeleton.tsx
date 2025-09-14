import Skeleton from '../Skeleton';

export function WeatherCardSkeleton() {
  return (
    <div className="relative flex items-center justify-between bg-gray-200 rounded-2xl p-5">
      <div className="flex items-center gap-3">
        <Skeleton
          className="size-12 rounded-full"
          dataTestId="skeleton-avatar"
        />
        <div>
          <Skeleton className="h-6 w-24 mb-2" dataTestId="skeleton-city" />
          <Skeleton className="h-3 w-16" dataTestId="skeleton-time" />
        </div>
      </div>

      <Skeleton className="size-10" dataTestId="skeleton-temp" />
    </div>
  );
}
