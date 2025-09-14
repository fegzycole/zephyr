import { ReactNode, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import IconButton from '../IconButton';

interface LoadMorePaginationProps {
  totalCount: number;
  initialCount?: number;
  step?: number;
  children: (visibleCount: number) => ReactNode;
}

export default function LoadMorePagination({
  totalCount,
  initialCount = 5,
  step = 5,
  children,
}: LoadMorePaginationProps) {
  const [visibleCount, setVisibleCount] = useState(initialCount);

  const handleLoadMore = () =>
    setVisibleCount((prev) => Math.min(prev + step, totalCount));

  return (
    <div>
      {children(visibleCount)}

      {visibleCount < totalCount && (
        <div className="mt-4 flex justify-center">
          <IconButton
            icon={ChevronDown}
            onAction={handleLoadMore}
            className="bg-foreground"
            iconClassName="w-6 h-6 text-white"
            disabled={false}
            dataTestId='load-more-icon'
          />
        </div>
      )}
    </div>
  );
}
