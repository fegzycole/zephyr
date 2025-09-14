import { describe, it, beforeEach, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import WeatherDetailCard from './WeatherDetailCard';

describe('WeatherDetailCard Component (unit/integration)', () => {
  let label: string;
  let value: string;
  let icon: string;

  beforeEach(() => {
    label = 'Test Label';
    value = '65 %';
    icon = 'testicon.svg';
  });

  const renderCard = (
    props?: Partial<React.ComponentProps<typeof WeatherDetailCard>>
  ) =>
    render(
      <WeatherDetailCard label={label} value={value} icon={icon} {...props} />
    );

  it('renders label, value and icon correctly', () => {
    renderCard();
    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByText(value)).toBeInTheDocument();
    expect(screen.getByAltText(`${label} icon`)).toBeInTheDocument();
  });

  it('renders icon with correct src', () => {
    renderCard();
    const image = screen.getByAltText(`${label} icon`);
    expect(image).toHaveAttribute('src', `/weather_details/${icon}`);
  });

  it('applies correct text classes for label and value', () => {
    renderCard();
    expect(screen.getByText(label)).toHaveClass('text-xl', 'text-detail');
    expect(screen.getByText(value)).toHaveClass(
      'text-3xl',
      'text-foreground',
      'font-semibold'
    );
  });

  it('matches snapshot', () => {
    const { container } = renderCard();
    expect(container.firstChild).toMatchSnapshot();
  });
});
