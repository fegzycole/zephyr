import clsx from 'clsx';

interface ISkeletonProps {
  className?: string;
  dataTestId?: string;
}

export default function Skeleton({ className, dataTestId }: ISkeletonProps) {
  return (
    <div
      className={clsx('bg-gray-300 rounded animate-pulse', className)}
      data-testid={dataTestId}
    />
  );
}
