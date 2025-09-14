import { render, screen } from '@testing-library/react';
import NoWeatherData from './NoWeatherData';
import { describe, it, expect } from 'vitest';

describe('NoWeatherData', () => {
  it('renders correctly and matches snapshot', () => {
    const { container } = render(<NoWeatherData />);
    expect(container).toMatchSnapshot();
  });

  it('displays the icon', () => {
    render(<NoWeatherData />);
    expect(screen.getByTestId('lucide-icon')).toBeInTheDocument();
  });

  it('displays the correct text', () => {
    render(<NoWeatherData />);
    expect(
      screen.getByText('No Weather Information Available')
    ).toBeInTheDocument();
  });
});
