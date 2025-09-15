import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

vi.mock('./components/Navbar', () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));

vi.mock('./components/ToastContainer', () => ({
  default: () => <div data-testid="toast-container">Toast</div>,
}));

vi.mock('./pages/HomePage', () => ({
  default: () => <div data-testid="home-page">HomePage</div>,
}));

vi.mock('./pages/WeatherPage', () => ({
  default: () => <div data-testid="weather-page">WeatherPage</div>,
}));

const mockUseUserLocation = vi.fn();
vi.mock('./hooks/useUserLocation', () => ({
  useUserLocation: () => mockUseUserLocation(),
}));

vi.mock('zustand/react/shallow', () => ({
  useShallow: <T, U>(selector: (state: T) => U) => selector,
}));

interface MockStore {
  loadCities: () => void;
  loadFavorites: () => void;
  loadNotes: () => void;
  cleanExpiredToasts: () => void;
}

let mockStoreState: MockStore = {
  loadCities: () => undefined,
  loadFavorites: () => undefined,
  loadNotes: () => undefined,
  cleanExpiredToasts: () => undefined,
};

vi.mock('./store', () => ({
  useStore: <T,>(selector: (s: MockStore) => T): T => selector(mockStoreState),
}));

describe('<App />', () => {
  const mockLoadCities = vi.fn();
  const mockLoadFavorites = vi.fn();
  const mockLoadNotes = vi.fn();
  const mockCleanExpiredToasts = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockStoreState = {
      loadCities: mockLoadCities,
      loadFavorites: mockLoadFavorites,
      loadNotes: mockLoadNotes,
      cleanExpiredToasts: mockCleanExpiredToasts,
    };
  });

  it('renders Navbar and ToastContainer', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('toast-container')).toBeInTheDocument();
  });

  it('renders HomePage on "/" route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('renders WeatherPage on "/weather" route', () => {
    render(
      <MemoryRouter initialEntries={['/weather']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId('weather-page')).toBeInTheDocument();
  });

  it('calls loadCities, loadFavorites, loadNotes and cleanExpiredToasts on mount', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(mockLoadCities).toHaveBeenCalledTimes(1);
    expect(mockLoadFavorites).toHaveBeenCalledTimes(1);
    expect(mockLoadNotes).toHaveBeenCalledTimes(1);
    expect(mockCleanExpiredToasts).toHaveBeenCalledTimes(1);
  });

  it('calls useUserLocation hook', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(mockUseUserLocation).toHaveBeenCalledTimes(1);
  });

  it('matches wrapper snapshot (regression for layout/classes)', () => {
    const { container } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
