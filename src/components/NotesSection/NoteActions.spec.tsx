import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import NoteActions from './NoteActions';

interface MockIconButtonProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onAction: () => void;
  className?: string;
  iconClassName?: string;
}

let renderCount = 0;

vi.mock('../IconButton', () => ({
  default: ({ onAction }: MockIconButtonProps) => {
    renderCount += 1;

    const testId = renderCount === 1 ? 'Edit2Icon' : 'TrashIcon';

    return (
      <button type="button" data-testid={testId} onClick={onAction}>
        {testId}
      </button>
    );
  },
}));

describe('NoteActions', () => {
  const onEdit = vi.fn();
  const onRemove = vi.fn();

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    renderCount = 0;
  });

  it('matches snapshot', () => {
    const { container } = render(
      <NoteActions onEdit={onEdit} onRemove={onRemove} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders edit and remove buttons', () => {
    render(<NoteActions onEdit={onEdit} onRemove={onRemove} />);
    expect(screen.getByTestId('Edit2Icon')).toBeInTheDocument();
    expect(screen.getByTestId('TrashIcon')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(<NoteActions onEdit={onEdit} onRemove={onRemove} />);
    fireEvent.click(screen.getByTestId('Edit2Icon'));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onRemove when remove button is clicked', () => {
    render(<NoteActions onEdit={onEdit} onRemove={onRemove} />);
    fireEvent.click(screen.getByTestId('TrashIcon'));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
