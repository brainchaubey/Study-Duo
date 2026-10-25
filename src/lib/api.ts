// API base configuration for flexible deployment
// When hosted on a static host like GitHub Pages, VITE_API_URL can point to a free backend URL
// When running full-stack (like in development or Cloud Run container), it defaults to relative paths ('')
export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export function getApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE}${cleanEndpoint}`;
}
