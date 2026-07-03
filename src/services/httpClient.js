// Base URL for a real backend. Unset (demo mode) => the app runs entirely
// on the in-browser mock adapters, so it can be deployed as a static site
// with no server at all. Set VITE_API_BASE_URL to point at a real REST API
// (e.g. https://api.example.com) once one exists — no other code changes needed.
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

export const isBackendConfigured = API_BASE_URL.length > 0;

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  if (response.status === 204) return null;
  return response.json();
}
