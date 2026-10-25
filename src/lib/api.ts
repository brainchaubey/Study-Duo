// API base configuration & safe network communication
// Resolves backend URL across local dev, external free backends (e.g. Render, Koyeb), and static GitHub Pages

export function isRunningOnStaticHost(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.hostname.endsWith('github.io');
}

export function getStoredBackendUrl(): string {
  if (typeof window === 'undefined') return '';
  return (localStorage.getItem('studyduo_backend_url') || '').trim().replace(/\/$/, '');
}

export function setStoredBackendUrl(url: string) {
  if (typeof window === 'undefined') return;
  const clean = url.trim().replace(/\/$/, '');
  if (clean) {
    localStorage.setItem('studyduo_backend_url', clean);
  } else {
    localStorage.removeItem('studyduo_backend_url');
  }
}

export function getApiBaseUrl(): string {
  // 1. User configured backend in localStorage
  const stored = getStoredBackendUrl();
  if (stored) return stored;

  // 2. Build-time environment variable
  const envUrl = (import.meta.env.VITE_API_URL || '').trim().replace(/\/$/, '');
  if (envUrl) return envUrl;

  // 3. Relative path for full-stack server
  return '';
}

export function getApiUrl(endpoint: string): string {
  const base = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${cleanEndpoint}`;
}

export async function safeFetchJson<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const targetUrl = getApiUrl(endpoint);

  // If on GitHub Pages and no backend URL is set, fail early with clear diagnostic
  if (isRunningOnStaticHost() && !getApiBaseUrl()) {
    throw new Error(
      'GitHub Pages is static hosting and cannot run the Node.js chat server. Please configure your free backend URL in Backend Settings.'
    );
  }

  let res: Response;
  try {
    res = await fetch(targetUrl, options);
  } catch (err: any) {
    throw new Error(
      `Unable to connect to chat server at "${getApiBaseUrl() || window.location.origin}". Verify the backend is running and accessible.`
    );
  }

  const contentType = res.headers.get('content-type') || '';

  // Crucial: check for non-JSON content BEFORE attempting to parse
  if (!contentType.includes('application/json')) {
    if (res.status === 404 || res.status === 405) {
      throw new Error(
        `Backend endpoint not found on "${getApiBaseUrl() || window.location.origin}" (HTTP ${res.status}). Verify your backend URL.`
      );
    }
    if (res.status === 302 || res.redirected) {
      throw new Error(
        'Backend URL redirected to an HTML page. Ensure you are using a direct public API endpoint, not a preview wrapper.'
      );
    }
    throw new Error(`Server returned non-JSON response (HTTP ${res.status}).`);
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Server returned error (${res.status})`);
  }

  return data;
}
