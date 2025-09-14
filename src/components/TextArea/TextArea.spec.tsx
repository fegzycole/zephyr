import { describe, it, beforeEach, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TextArea from './TextArea';

describe('TextArea Component (unit/integration)', () => {
  let value: string;
  let placeholder: string;
  let customClass: string;
  let id: string;
  let rows: number;
  let handleChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    value = 'Test message content';
    placeholder = 'test placeholder text';
    customClass = 'custom-class';
    id = '12345678-abcd-efgh-ijkl-123456789012';
    rows = 6;
    handleChange = vi.fn();
  });

  it('renders with provided value', () => {
    render(<TextArea value={value} onChange={handleChange} />);
    const textarea = screen.getByDisplayValue(value);
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('calls onChange when user types', () => {
    render(<TextArea value="" onChange={handleChange} />);
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('renders with default placeholder when none is provided', () => {
    render(<TextArea value={value} onChange={handleChange} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('placeholder', '');
  });

  it('renders with custom placeholder', () => {
    render(
      <TextArea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />
    );
    expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
  });

  it('applies custom className along with defaults', () => {
    render(
      <TextArea value={value} onChange={handleChange} className={customClass} />
    );
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('w-full', 'block', 'text-foreground');
    expect(textarea).toHaveClass(customClass);
  });

  it('applies provided id to the element', () => {
    render(<TextArea value={value} onChange={handleChange} id={id} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('id', id);
  });

  it('renders with default rows=8', () => {
    render(<TextArea value={value} onChange={handleChange} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('rows', '8');
  });

  it('renders with custom rows when provided', () => {
    render(<TextArea value={value} onChange={handleChange} rows={rows} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('rows', rows.toString());
  });

  it('matches snapshot', () => {
    const { container } = render(
      <TextArea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={customClass}
        id={id}
        rows={rows}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
