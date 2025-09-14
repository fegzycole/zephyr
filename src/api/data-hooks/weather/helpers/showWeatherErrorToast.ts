import { useStore } from '@store';

export function showWeatherErrorToast(errorCode?: number) {
  const store = useStore.getState();
  if (errorCode === 615) {
    store.addToast('Weather info not found', 'warn');
  } else {
    store.addToast(
      'Unable to load weather data. Check your internet connection and try again later.',
      'error'
    );
  }
}
