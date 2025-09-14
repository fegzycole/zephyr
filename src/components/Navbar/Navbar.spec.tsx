import { render, screen } from '@testing-library/react';
import { describe, it, beforeEach, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

describe('Navbar Component (integration)', () => {
  let rootPath: string;
  let weatherPath: string;

  beforeEach(() => {
    rootPath = '/';
    weatherPath = '/weather';
  });

  const renderWithRouter = (initialPath: string) =>
    render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Navbar />
      </MemoryRouter>
    );

  it('renders the logo with correct src and alt text', () => {
    renderWithRouter(rootPath);
    const logo = screen.getByAltText('logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', expect.stringContaining('weather.png'));
  });

  it('renders navigation items with expected labels', () => {
    renderWithRouter(rootPath);
    expect(screen.getByText(/Cities/i)).toBeInTheDocument();
    expect(screen.getByText(/Weather/i)).toBeInTheDocument();
  });

  it('applies active class to current route', () => {
    renderWithRouter(weatherPath);

    const activeLink = screen.getByText(/Weather/i).closest('a');
    const inactiveLink = screen.getByText(/Cities/i).closest('a');

    expect(activeLink).toHaveClass('text-active');
    expect(inactiveLink).toHaveClass('text-subtle');
  });

  it('applies correct icon scaling based on active state', () => {
    renderWithRouter(rootPath);

    const citiesIcon = screen.getByText(/Cities/i).previousSibling;
    const weatherIcon = screen.getByText(/Weather/i).previousSibling;

    expect(citiesIcon).toHaveClass('scale-110');
    expect(weatherIcon).toHaveClass('scale-100');
  });

  it('renders links with correct href attributes', () => {
    renderWithRouter(rootPath);

    const citiesLink = screen.getByText(/Cities/i).closest('a');
    const weatherLink = screen.getByText(/Weather/i).closest('a');

    expect(citiesLink).toHaveAttribute('href', rootPath);
    expect(weatherLink).toHaveAttribute('href', weatherPath);
  });

  it('matches snapshot', () => {
    const { container } = renderWithRouter(rootPath);
    expect(container.firstChild).toMatchSnapshot();
  });
});
