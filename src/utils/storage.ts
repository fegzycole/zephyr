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

const USER_CITY_KEY = 'userCity';

export function addUserCityToSessionStorage(value: string) {
  sessionStorage.setItem(USER_CITY_KEY, value);
}

export function removeUserCityFromSessionStorage() {
  sessionStorage.removeItem(USER_CITY_KEY);
}

export function getUserCityFromSessionStorage() {
  const item = sessionStorage.getItem(USER_CITY_KEY);

  return item;
}
