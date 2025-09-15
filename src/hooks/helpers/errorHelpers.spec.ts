import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mapGeolocationError, showErrorToast } from './errorHelpers';
import * as storage from '@utils/storage';

vi.mock('@utils/storage', () => {
  return {
    getCache: vi.fn<() => ReturnType<typeof storage.getCache>>(),
    setCache: vi.fn<() => ReturnType<typeof storage.setCache>>(),
  };
});

import { getCache, setCache } from '@utils/storage';

describe('mapGeolocationError', () => {
  it('returns UNAVAILABLE for other error codes', () => {
    const err = { code: 2 } as GeolocationPositionError;
    expect(mapGeolocationError(err)).toBe('UNAVAILABLE');
  });
});

describe('showErrorToast', () => {
  const addToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows UNSUPPORTED error toast', async () => {
    await showErrorToast('UNSUPPORTED', addToast);
    expect(addToast).toHaveBeenCalledWith(
      'Geolocation not supported in this browser.',
      'error'
    );
  });

  it('does not show PERMISSION_DENIED toast when cache exists', async () => {
    (getCache as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      'true'
    );

    await showErrorToast('PERMISSION_DENIED', addToast);

    expect(addToast).not.toHaveBeenCalled();
    expect(setCache).not.toHaveBeenCalled();
  });

  it('shows UNAVAILABLE error toast', async () => {
    await showErrorToast('UNAVAILABLE', addToast);
    expect(addToast).toHaveBeenCalledWith(
      'Unable to determine location. Try again later.',
      'error'
    );
  });
});
