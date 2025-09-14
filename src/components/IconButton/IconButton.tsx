import clsx from 'clsx';
import { SVGProps } from 'react';

interface IconButtonProps {
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
  onAction: () => void;
  className?: string;
  iconClassName?: string;
  disabled?: boolean;
  dataTestId?: string;
}

export default function IconButton({
  icon: Icon,
  onAction,
  className,
  iconClassName,
  disabled = false,
  dataTestId,
}: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onAction}
      disabled={disabled}
      className={clsx(
        'group p-2 rounded-full shadow transition-colors cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      data-testid={dataTestId}
    >
      <Icon
        className={clsx(
          'w-5 h-5 transition-colors',
          disabled && 'cursor-not-allowed',
          iconClassName
        )}
      />
    </button>
  );
}
