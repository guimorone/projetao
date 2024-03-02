import type { LatLngExpression } from 'leaflet';

export const DEFAULT_DOCUMENT_TITLE: string = import.meta.env.VITE_APP_NAME;
export const RECIFE_COORDS: LatLngExpression = [-8.05, -34.9];
export const POLLS_STALE_TIME: number = 10 * 1000; // 10 segundos de cache
