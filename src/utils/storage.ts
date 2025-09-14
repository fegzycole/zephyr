import localforage from 'localforage';

localforage.config({
  name: 'weather-app',
  storeName: 'weather-cache',
});

export async function setCache<T>(key: string, value: T) {
  await localforage.setItem(key, value);
}

export async function getCache<T>(key: string): Promise<T | null> {
  return (await localforage.getItem<T>(key)) ?? null;
}
