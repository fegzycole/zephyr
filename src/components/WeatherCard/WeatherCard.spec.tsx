import { render, screen, fireEvent } from '@testing-library/react';
import {
  describe,
  it,
  beforeAll,
  afterAll,
  beforeEach,
  expect,
  vi,
} from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { faker } from '@faker-js/faker';
import { WeatherCard } from './WeatherCard';

describe('WeatherCard Component (unit/integration)', () => {
  let city: string;
  let time: string;
  let temp: string;
  let icon: string;
  let onFavoriteToggle: ReturnType<typeof vi.fn>;
  let onRemoveCity: ReturnType<typeof vi.fn>;

  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-01-01T11:10:00Z'));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  beforeEach(() => {
    faker.seed(321);
    city = faker.location.city();
    time = new Date().toLocaleTimeString();
    temp = faker.number.int({ min: -10, max: 40 }).toString();
    icon = faker.image.url();
    onFavoriteToggle = vi.fn();
    onRemoveCity = vi.fn();
  });

  const renderCard = (
    props?: Partial<React.ComponentProps<typeof WeatherCard>>
  ) =>
    render(
      <MemoryRouter>
        <WeatherCard
          city={city}
          time={time}
          temp={temp}
          icon={icon}
          isFavorite={false}
          canDelete={true}
          onFavoriteToggle={onFavoriteToggle}
          onRemoveCity={onRemoveCity}
          {...props}
        />
      </MemoryRouter>
    );

  it('renders city, time, temperature and icon correctly', () => {
    renderCard();
    expect(screen.getByText(city)).toBeInTheDocument();
    expect(screen.getByText(time)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`${temp}°C`))).toBeInTheDocument();
    expect(screen.getByAltText(`${city} icon`)).toHaveAttribute('src', icon);
  });

  it('renders link with correct href', () => {
    renderCard();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute(
      'href',
      `/weather?city=${encodeURIComponent(city)}`
    );
  });

  it('renders delete button when canDelete=true', () => {
    renderCard({ canDelete: true });
    expect(screen.getByTestId('delete-icon')).toBeInTheDocument();
  });

  it('does not render delete button when canDelete=false', () => {
    renderCard({ canDelete: false });
    expect(screen.queryByTestId('delete-icon')).not.toBeInTheDocument();
  });

  it('calls onFavoriteToggle when favorite icon clicked', () => {
    renderCard();
    fireEvent.click(screen.getByTestId('favorite-icon'));
    expect(onFavoriteToggle).toHaveBeenCalledTimes(1);
  });

  it('calls onRemoveCity when delete icon clicked', () => {
    renderCard({ canDelete: true });
    fireEvent.click(screen.getByTestId('delete-icon'));
    expect(onRemoveCity).toHaveBeenCalledTimes(1);
  });

  it('applies active favorite styling when isFavorite=true', () => {
    renderCard({ isFavorite: true });
    expect(screen.getByTestId('favorite-icon').firstChild).toHaveClass(
      'text-yellow-400',
      'fill-yellow-400'
    );
  });

  it('applies inactive favorite styling when isFavorite=false', () => {
    renderCard({ isFavorite: false });
    expect(screen.getByTestId('favorite-icon').firstChild).toHaveClass(
      'text-subtle'
    );
  });

  it('matches snapshot', () => {
    const { container } = renderCard();
    expect(container.firstChild).toMatchSnapshot();
  });
});
