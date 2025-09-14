import { describe, it, beforeEach, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SVGProps } from 'react';
import IconButton from './IconButton';

function MockIcon(props: SVGProps<SVGSVGElement>) {
  return <svg data-testid="mock-icon" {...props} />;
}

describe('IconButton Component', () => {
  const onAction = vi.fn();
  const defaultProps = {
    icon: MockIcon,
    onAction,
    dataTestId: 'icon-button',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the button and icon correctly', () => {
    render(<IconButton {...defaultProps} />);
    const button = screen.getByTestId('icon-button');
    expect(button).toBeInTheDocument();
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  it('calls onAction when clicked', () => {
    render(<IconButton {...defaultProps} />);
    fireEvent.click(screen.getByTestId('icon-button'));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('does not call onAction when disabled', () => {
    render(<IconButton {...defaultProps} disabled />);
    fireEvent.click(screen.getByTestId('icon-button'));
    expect(onAction).not.toHaveBeenCalled();
  });

  it('applies custom className and iconClassName', () => {
    render(
      <IconButton
        {...defaultProps}
        className="custom-button"
        iconClassName="custom-icon"
      />
    );
    const button = screen.getByTestId('icon-button');
    const icon = screen.getByTestId('mock-icon');
    expect(button).toHaveClass('custom-button');
    expect(icon).toHaveClass('custom-icon');
  });

  it('applies disabled styles when disabled', () => {
    render(<IconButton {...defaultProps} disabled />);
    const button = screen.getByTestId('icon-button');
    const icon = screen.getByTestId('mock-icon');
    expect(button).toHaveClass(
      'disabled:opacity-50',
      'disabled:cursor-not-allowed'
    );
    expect(icon).toHaveClass('cursor-not-allowed');
  });

  it('renders as a button with type="button"', () => {
    render(<IconButton {...defaultProps} />);
    expect(screen.getByTestId('icon-button')).toHaveAttribute('type', 'button');
  });
});
