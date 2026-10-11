export const API_BASE = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000').replace(/\/$/, '');
export const API_URL = `${API_BASE}/api`;

export const toApiUrl = (path = '') => { 
  if (!path) return API_URL;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${normalized}`;
};

export const toAssetUrl = (path) => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return toApiUrl(path.replace(/^\/+/, ''));
};
