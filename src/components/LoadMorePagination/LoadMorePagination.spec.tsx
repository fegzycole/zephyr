import { render, screen, fireEvent } from '@testing-library/react';
import LoadMorePagination from './LoadMorePagination';
import { describe, expect, it } from 'vitest';

describe('LoadMorePagination', () => {
  it('renders children with initialCount', () => {
    render(
      <LoadMorePagination totalCount={10} initialCount={3}>
        {(visible) => <div data-testid="visible">{visible}</div>}
      </LoadMorePagination>
    );

    expect(screen.getByTestId('visible')).toHaveTextContent('3');
  });

  it('increases visible count by step when load more is clicked', () => {
    render(
      <LoadMorePagination totalCount={10} initialCount={3} step={4}>
        {(visible) => <div data-testid="visible">{visible}</div>}
      </LoadMorePagination>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByTestId('visible')).toHaveTextContent('7');
  });

  it('does not exceed totalCount when loading more', () => {
    render(
      <LoadMorePagination totalCount={8} initialCount={5} step={5}>
        {(visible) => <div data-testid="visible">{visible}</div>}
      </LoadMorePagination>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByTestId('visible')).toHaveTextContent('8');
  });

  it('hides load more button when all items are visible', () => {
    render(
      <LoadMorePagination totalCount={3} initialCount={3}>
        {(visible) => <div data-testid="visible">{visible}</div>}
      </LoadMorePagination>
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(
      <LoadMorePagination totalCount={10}>
        {(visible) => <div>Visible: {visible}</div>}
      </LoadMorePagination>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
