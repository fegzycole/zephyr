import { render, screen } from '@testing-library/react';
import { NoteSectionSkeleton } from './NoteSectionSkeleton';
import { describe, it, expect } from 'vitest';

describe('NoteSectionSkeleton', () => {
  it('renders the wrapper', () => {
    render(<NoteSectionSkeleton />);
    expect(screen.getByTestId('comment-section-skeleton')).toBeInTheDocument();
  });

  it('renders the correct number of Skeleton components', () => {
    render(<NoteSectionSkeleton />);
    expect(screen.getAllByTestId('skeleton')).toHaveLength(5);
  });

  it('matches snapshot', () => {
    const { container } = render(<NoteSectionSkeleton />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
