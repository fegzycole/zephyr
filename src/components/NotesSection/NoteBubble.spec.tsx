import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import NoteBubble from './NoteBubble';

describe('NoteBubble', () => {
  it('renders children correctly', () => {
    render(<NoteBubble>Test Note</NoteBubble>);
    expect(screen.getByText('Test Note')).toBeInTheDocument();
  });

  it('matches snapshot with text child', () => {
    const { container } = render(<NoteBubble>Snapshot Test</NoteBubble>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with nested element child', () => {
    const { container } = render(
      <NoteBubble>
        <span data-testid="nested">Nested Content</span>
      </NoteBubble>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
