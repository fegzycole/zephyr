import { describe, it, expect, vi, beforeEach } from 'vitest';
import { showWeatherErrorToast } from './showWeatherErrorToast';
import { useStore } from '@store';

describe('showWeatherErrorToast', () => {
  const addToastMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    useStore.getState = vi.fn().mockReturnValue({
      addToast: addToastMock,
    });
  });

  it('should show a warning toast if error code is 615', () => {
    showWeatherErrorToast(615);
    expect(addToastMock).toHaveBeenCalledOnce();
    expect(addToastMock).toHaveBeenCalledWith('Weather info not found', 'warn');
  });

  it('should show an error toast for other error codes', () => {
    showWeatherErrorToast(500);
    expect(addToastMock).toHaveBeenCalledOnce();
    expect(addToastMock).toHaveBeenCalledWith(
      'Unable to load weather data. Check your internet connection and try again later.',
      'error'
    );
  });

  it('should show an error toast if no error code is provided', () => {
    showWeatherErrorToast();
    expect(addToastMock).toHaveBeenCalledOnce();
    expect(addToastMock).toHaveBeenCalledWith(
      'Unable to load weather data. Check your internet connection and try again later.',
      'error'
    );
  });
});
