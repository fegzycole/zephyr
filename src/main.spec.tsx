import React, { StrictMode } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockRender = vi.fn();

const mockCreateRoot = vi.fn(() => ({ render: mockRender }));

vi.mock('react-dom/client', () => ({
  createRoot: mockCreateRoot,
}));

const MockApp: React.FC = () => <div data-testid="mock-app">APP</div>;
vi.mock('./App.tsx', () => ({ default: MockApp }));

vi.mock('./index.css', () => ({}));

describe('index entry (createRoot + render)', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    document.body.innerHTML = '<div id="root"></div>';
  });

  it('calls createRoot with the #root element and renders the app tree', async () => {
    await import('./main');

    const rootEl = document.getElementById('root');
    expect(rootEl).not.toBeNull();
    expect(mockCreateRoot).toHaveBeenCalledTimes(1);
    expect(mockCreateRoot).toHaveBeenCalledWith(rootEl);

    expect(mockRender).toHaveBeenCalledTimes(1);
    const renderedElement = mockRender.mock.calls[0][0];

    expect(renderedElement.type).toBe(StrictMode);

    const browserRouterElement = renderedElement.props.children;
    expect(browserRouterElement).toBeDefined();
    expect(browserRouterElement.type).toBe(BrowserRouter);

    const providerElement = browserRouterElement.props.children;
    expect(providerElement).toBeDefined();
    expect(providerElement.type).toBe(QueryClientProvider);

    const providerPropsClient = providerElement.props.client;
    expect(providerPropsClient).toBeInstanceOf(QueryClient);

    const appElement = providerElement.props.children;
    expect(appElement).toBeDefined();
    expect(appElement.type).toBe(MockApp);
  });
});
