import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { faker } from '@faker-js/faker';
import SearchBar from './SearchBar';

describe('SearchBar Component (unit)', () => {
  let value: string;
  let placeholder: string;
  let customClass: string;
  let onChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    faker.seed(99);
    value = faker.location.city();
    placeholder = faker.lorem.words(2);
    customClass = faker.word.sample();
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
