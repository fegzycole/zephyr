import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import EditableNote from './EditableNote';

const updateNote = vi.fn();
const removeNote = vi.fn();

vi.mock('../../store', () => {
  type MockStore = {
    updateNote: (city: string, id: string, value: string) => void;
    removeNote: (city: string, id: string) => void;
  };

  const mockState: MockStore = {
    updateNote: (...args) => updateNote(...args),
    removeNote: (...args) => removeNote(...args),
  };

  return {
    useStore: (selector: (s: MockStore) => unknown) => selector(mockState),
  };
});

vi.mock('./NoteBubble', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="comment-bubble">{children}</div>
  ),
}));

vi.mock('./NoteActions', () => ({
  default: ({
    onEdit,
    onRemove,
  }: {
    onEdit: () => void;
    onRemove: () => void;
  }) => (
    <div>
      <button data-testid="edit" onClick={onEdit}>
        edit
      </button>
      <button data-testid="remove" onClick={onRemove}>
        remove
      </button>
    </div>
  ),
}));

vi.mock('./NoteBox', () => ({
  default: ({
    value,
    onChange,
    onCancel,
    onSave,
  }: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCancel: () => void;
    onSave: () => void;
  }) => (
    <div>
      <input data-testid="comment-input" value={value} onChange={onChange} />
      <button data-testid="cancel" onClick={onCancel}>
        cancel
      </button>
      <button data-testid="save" onClick={onSave}>
        save
      </button>
    </div>
  ),
}));

describe('EditableNote', () => {
  const props = { value: 'Initial comment', id: '123', city: 'TestCity' };

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('matches snapshot (default state)', () => {
    const { container } = render(<EditableNote {...props} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the initial comment text and actions', () => {
    render(<EditableNote {...props} />);
    expect(screen.getByText('Initial comment')).toBeInTheDocument();
    expect(screen.getByTestId('edit')).toBeInTheDocument();
    expect(screen.getByTestId('remove')).toBeInTheDocument();
  });

  it('enters edit mode when edit button is clicked', () => {
    render(<EditableNote {...props} />);
    fireEvent.click(screen.getByTestId('edit'));
    expect(screen.getByTestId('comment-input')).toHaveValue('Initial comment');
  });

  it('cancels edit and resets text', () => {
    render(<EditableNote {...props} />);
    fireEvent.click(screen.getByTestId('edit'));

    fireEvent.change(screen.getByTestId('comment-input'), {
      target: { value: 'Changed text' },
    });

    fireEvent.click(screen.getByTestId('cancel'));

    expect(screen.getByText('Initial comment')).toBeInTheDocument();
  });

  it('saves edited text and calls updateNote', () => {
    render(<EditableNote {...props} />);
    fireEvent.click(screen.getByTestId('edit'));

    fireEvent.change(screen.getByTestId('comment-input'), {
      target: { value: 'Updated text' },
    });

    fireEvent.click(screen.getByTestId('save'));

    expect(updateNote).toHaveBeenCalledWith('TestCity', '123', 'Updated text');
    expect(screen.getByText('Updated text')).toBeInTheDocument();
  });

  it('calls removeNote when remove button is clicked', () => {
    render(<EditableNote {...props} />);
    fireEvent.click(screen.getByTestId('remove'));
    expect(removeNote).toHaveBeenCalledWith('TestCity', '123');
  });
});
