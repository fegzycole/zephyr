import { render, screen } from '@testing-library/react';
import ToastContainer from './ToastContainer';
import { beforeEach, describe, expect, it, vi } from 'vitest';

type Toast = { id: string; type: 'info' | 'error' | 'warn'; message: string };
interface StoreState {
  toasts: Toast[];
}

let mockToasts: Toast[] = [];

vi.mock('../../store', () => {
  return {
    useStore: (selector: (state: StoreState) => unknown) =>
      selector({ toasts: mockToasts }),
  };
});

describe('ToastContainer', () => {
  beforeEach(() => {
    mockToasts = [];
  });

  it('renders nothing when store has no toasts', () => {
    render(<ToastContainer />);
    expect(screen.queryByText(/./)).toBeNull();
  });

  it('renders an info toast with correct style', () => {
    mockToasts = [{ id: '1', type: 'info', message: 'Operation successful' }];

    render(<ToastContainer />);

    const toast = screen.getByText('Operation successful');
    expect(toast).toBeInTheDocument();
    expect(toast.parentElement).toHaveClass('bg-primary');
  });

  it('renders a warn toast with correct style', () => {
    mockToasts = [{ id: '1', type: 'warn', message: 'A warning' }];

    render(<ToastContainer />);

    const toast = screen.getByText('A warning');
    expect(toast).toBeInTheDocument();
    expect(toast.parentElement).toHaveClass('bg-yellow-400');
  });

  it('renders an error toast with correct style', () => {
    mockToasts = [{ id: '2', type: 'error', message: 'Something went wrong' }];

    render(<ToastContainer />);

    const toast = screen.getByText('Something went wrong');
    expect(toast).toBeInTheDocument();
    expect(toast.parentElement).toHaveClass('bg-red-300');
  });

  it('renders multiple toasts', () => {
    mockToasts = [
      { id: '1', type: 'warn', message: 'First toast' },
      { id: '2', type: 'error', message: 'Second toast' },
    ];

    render(<ToastContainer />);

    expect(screen.getByText('First toast')).toBeInTheDocument();
    expect(screen.getByText('Second toast')).toBeInTheDocument();
  });
});
