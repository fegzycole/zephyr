import Skeleton from '../Skeleton';

export function WeatherDetailCardSkeleton() {
  return (
    <div className="bg-gray-200 rounded-2xl p-5 flex gap-4">
      <Skeleton className="size-6" dataTestId="skeleton-icon" />

      <div>
        <Skeleton className="h-6 w-18 mb-2" dataTestId="skeleton-label" />
        <Skeleton className="h-8 w-36" dataTestId="skeleton-value" />
      </div>
    </div>
  );
}
