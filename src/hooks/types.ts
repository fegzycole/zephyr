export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export type LocationError = 'UNSUPPORTED' | 'PERMISSION_DENIED' | 'UNAVAILABLE' | null;
