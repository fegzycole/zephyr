import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import NoteBox from './NoteBox';

vi.mock('../TextArea', () => ({
  default: ({
    value,
    onChange,
    rows,
    className,
  }: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    rows?: number;
    className?: string;
  }) => (
    <textarea
      data-testid="textarea"
      value={value}
      onChange={onChange}
      rows={rows}
      className={className}
    />
  ),
}));

vi.mock('../IconButton/IconButton', () => ({
  default: ({
    onAction,
    disabled,
  }: {
    onAction: () => void;
    disabled?: boolean;
  }) => {
    const testId = disabled === undefined ? 'cancel-button' : 'save-button';
    return (
      <button data-testid={testId} onClick={onAction} disabled={disabled}>
        {testId}
      </button>
    );
  },
}));

describe('NoteBox', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('matches snapshot (empty value)', () => {
    const { asFragment } = render(
      <NoteBox
        value=""
        onChange={() => {}}
        onCancel={() => {}}
        onSave={() => {}}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot (non-empty value)', () => {
    const { asFragment } = render(
      <NoteBox
        value="Hello"
        onChange={() => {}}
        onCancel={() => {}}
        onSave={() => {}}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders textarea with given value and rows', () => {
    render(
      <NoteBox
        value="Some text"
        rows={5}
        onChange={() => {}}
        onCancel={() => {}}
        onSave={() => {}}
      />
    );
    const ta = screen.getByTestId('textarea') as HTMLTextAreaElement;
    expect(ta).toHaveValue('Some text');
    expect(ta.getAttribute('rows')).toBe('5');
  });

  it('calls onChange when typing', () => {
    const onChange = vi.fn();
    render(
      <NoteBox
        value=""
        onChange={onChange}
        onCancel={() => {}}
        onSave={() => {}}
      />
    );
    fireEvent.change(screen.getByTestId('textarea'), {
      target: { value: 'x' },
    });
    expect(onChange).toHaveBeenCalled();
  });

  it('hides cancel and disables save when value is empty/whitespace', () => {
    render(
      <NoteBox
        value="   "
        onChange={() => {}}
        onCancel={() => {}}
        onSave={() => {}}
      />
    );
    expect(screen.queryByTestId('cancel-button')).toBeNull();
    expect(screen.getByTestId('save-button')).toBeDisabled();
  });

  it('shows cancel and enables save when value is non-empty', () => {
    render(
      <NoteBox
        value="Save me"
        onChange={() => {}}
        onCancel={() => {}}
        onSave={() => {}}
      />
    );
    expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
    expect(screen.getByTestId('save-button')).not.toBeDisabled();
  });

  it('calls onCancel when cancel button clicked', () => {
    const onCancel = vi.fn();
    render(
      <NoteBox
        value="Cancel"
        onChange={() => {}}
        onCancel={onCancel}
        onSave={() => {}}
      />
    );
    fireEvent.click(screen.getByTestId('cancel-button'));
    expect(onCancel).toHaveBeenCalled();
  });

  it('calls onSave when save button clicked', () => {
    const onSave = vi.fn();
    render(
      <NoteBox
        value="Save this"
        onChange={() => {}}
        onCancel={() => {}}
        onSave={onSave}
      />
    );
    fireEvent.click(screen.getByTestId('save-button'));
    expect(onSave).toHaveBeenCalled();
  });
});
