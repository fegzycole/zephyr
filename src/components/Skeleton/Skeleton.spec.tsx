import { render, screen } from '@testing-library/react';
import { describe, it, beforeEach, expect } from 'vitest';
import { faker } from '@faker-js/faker';
import Skeleton from './Skeleton';

describe('Skeleton Component (unit)', () => {
  let customClass: string;
  let testId: string;

  beforeEach(() => {
    faker.seed(123);
    customClass = faker.word.sample();
    testId = faker.string.alphanumeric(10);
  });

  it('renders with default classes', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass('bg-gray-300', 'rounded', 'animate-pulse');
  });

  it('applies custom className along with defaults', () => {
    render(<Skeleton className={customClass} dataTestId={testId} />);
    const skeleton = screen.getByTestId(testId);
    expect(skeleton).toHaveClass('bg-gray-300', 'rounded', 'animate-pulse');
    expect(skeleton).toHaveClass(customClass);
  });

  it('renders with provided data-testid', () => {
    render(<Skeleton dataTestId={testId} />);
    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(
      <Skeleton className={customClass} dataTestId={testId} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
