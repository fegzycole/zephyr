import Skeleton from '../Skeleton';

export function NoteSectionSkeleton() {
  return (
    <div
      className="rounded-2xl justify-between w-full"
      data-testid="comment-section-skeleton"
    >
      <Skeleton className="w-full h-36" dataTestId="skeleton" />

      <div className="mt-5">
        <Skeleton className="w-40 h-8" dataTestId="skeleton" />
      </div>

      <div className="flex flex-col gap-3 items-end mt-5">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Skeleton className="h-14 w-48" key={idx} dataTestId="skeleton" />
        ))}
      </div>
    </div>
  );
}
