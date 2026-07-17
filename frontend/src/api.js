const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
const ASSET_URL = API_URL.replace("/api", "");

export function assetUrl(path) {
  if (!path) return "";
  return path.startsWith("http") ? path : `${ASSET_URL}${path}`;
}

export async function api(path, options = {}) {
  const token = localStorage.getItem("campus_cart_token");
  const headers = options.body instanceof FormData ? {} : { "Content-Type": "application/json" };

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}
