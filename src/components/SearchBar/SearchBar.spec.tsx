import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

describe('SearchBar Component (unit)', () => {
  let value: string;
  let placeholder: string;
  let customClass: string;
  let onChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    value = 'Orlando';
    placeholder = 'search placeholder';
    customClass = 'custom-search';
    onChange = vi.fn();
  });

  it('renders with provided value', () => {
    render(<SearchBar value={value} onChange={onChange} />);
    const input = screen.getByDisplayValue(value);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  it('calls onChange when user types', () => {
    render(<SearchBar value="" onChange={onChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('renders with default placeholder when none provided', () => {
    render(<SearchBar value={value} onChange={onChange} />);
    const input = screen.getByPlaceholderText('Search Cities');
    expect(input).toBeInTheDocument();
  });

  it('renders with custom placeholder when provided', () => {
    render(
      <SearchBar value={value} onChange={onChange} placeholder={placeholder} />
    );
    const input = screen.getByPlaceholderText(placeholder);
    expect(input).toBeInTheDocument();
  });

  it('applies custom className along with defaults', () => {
    render(
      <SearchBar value={value} onChange={onChange} className={customClass} />
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('bg-gray', 'rounded-xl', 'p-3');
    expect(input).toHaveClass(customClass);
  });

  it('matches snapshot', () => {
    const { container } = render(
      <SearchBar value={value} onChange={onChange} placeholder={placeholder} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
