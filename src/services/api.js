const BASE_URL = import.meta.env.VITE_API_URL;

const getCsrfToken = () => {
  const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));
  if (match) {
    return decodeURIComponent(match[2]);
  }
  return null;
};

const handleResponse = async (response, suppressAuthExpired = false) => {
  if (!response.ok) {
    let errorMsg = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorData.error || response.statusText;
    } catch (e) {
      errorMsg = response.statusText;
    }
    // If the token expired or session is invalid, broadcast logout event.
    // Auth endpoints (/auth/login, /auth/me, etc.) handle 401 themselves via
    // AuthContext — broadcasting auth:expired for them causes an infinite
    // redirect loop (page reloads → /auth/me returns 401 → redirect → reload…).
    if (!suppressAuthExpired && (response.status === 401 || errorMsg.toLowerCase().includes('token expired'))) {
      window.dispatchEvent(new CustomEvent('auth:expired'));
    }
    throw new Error(errorMsg);
  }
  // Check if it's JSON
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
};

const fetchWithAuth = async (endpoint, options = {}, isRetry = false) => {
  // Auth endpoints return 401 as normal business logic (no session, bad
  // credentials). Only non-auth endpoints should force a logout redirect.
  const isAuthEndpoint = endpoint.startsWith('/auth/');
  const csrfToken = getCsrfToken();
  const headers = new Headers(options.headers || {});
  const isMutation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method);

  if (isMutation && csrfToken) {
    headers.set('X-XSRF-TOKEN', csrfToken);
  }

  const config = {
    ...options,
    credentials: 'include',
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  // On 403, the CSRF token may be stale — re-fetch it once and retry
  if (response.status === 403 && isMutation && !isRetry) {
    try {
      await fetch(`${BASE_URL}/auth/csrf`, { credentials: 'include' });
    } catch (_) { /* ignore */ }
    return fetchWithAuth(endpoint, options, true);
  }

  return handleResponse(response, isAuthEndpoint);
};

export const api = {
  // 1. Auth
  login: async (email, password) => {
    return fetchWithAuth('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  },
  logout: async () => {
    return fetchWithAuth('/auth/logout', {
      method: 'POST',
    });
  },
  me: async () => {
    return fetchWithAuth('/auth/me');
  },
  // Prime the XSRF-TOKEN cookie — call this once on app startup so the backend
  // sets the cookie before any state-mutating requests are made.
  csrf: async () => {
    return fetchWithAuth('/auth/csrf');
  },
  changePassword: async (currentPassword, newPassword) => {
    return fetchWithAuth('/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  // 2. Public
  getPublicShops: async () => {
    return fetchWithAuth('/public/shops');
  },
  getShopBySlug: async (slug) => {
    return fetchWithAuth(`/public/shops/${slug}`);
  },
  incrementQrVisit: async (slug) => {
    return fetchWithAuth(`/public/shops/${slug}/qr-visit`, {
      method: 'POST',
    });
  },
  registerShop: async (shopData) => {
    return fetchWithAuth('/public/shops/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shopData),
    });
  },
  submitPrintJob: async (slug, formData) => {
    return fetchWithAuth(`/public/shops/${slug}/jobs`, {
      method: 'POST',
      // DO NOT set Content-Type for FormData, browser will set it with boundary
      body: formData,
    });
  },
  trackJobByToken: async (slug, token) => {
    return fetchWithAuth(`/public/shops/${slug}/jobs/${token}`);
  },

  // 3. Admin
  getDashboardStats: async (shopId) => {
    return fetchWithAuth(`/admin/shops/${shopId}/dashboard`);
  },
  getAdminJobs: async (shopId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchWithAuth(`/admin/shops/${shopId}/jobs?${query}`);
  },
  getAdminJobDetails: async (jobId) => {
    return fetchWithAuth(`/admin/jobs/${jobId}`);
  },
  getAdminJobByToken: async (shopId, token) => {
    return fetchWithAuth(`/admin/shops/${shopId}/jobs/token/${token}`);
  },
  updateAdminJob: async (jobId, data) => {
    return fetchWithAuth(`/admin/jobs/${jobId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },
  getShopProfile: async (shopId) => {
    return fetchWithAuth(`/admin/shops/${shopId}/profile`);
  },
  updateShopProfile: async (shopId, data) => {
    return fetchWithAuth(`/admin/shops/${shopId}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },


  // 4. Super Admin
  getPlatformAnalytics: async (from, to) => {
    const query = new URLSearchParams();
    if (from) query.append('from', from);
    if (to) query.append('to', to);
    return fetchWithAuth(`/super/analytics?${query.toString()}`);
  },
  getSuperShops: async (page = 0, size = 20) => {
    return fetchWithAuth(`/super/shops?page=${page}&size=${size}`);
  },
  getSuperShopDetails: async (shopId) => {
    return fetchWithAuth(`/super/shops/${shopId}`);
  },
  getSuperShopAnalytics: async (shopId, from, to) => {
    const query = new URLSearchParams();
    if (from) query.append('from', from);
    if (to) query.append('to', to);
    return fetchWithAuth(`/super/shops/${shopId}/analytics?${query.toString()}`);
  },
  createShopDirect: async (data) => {
    return fetchWithAuth('/super/shops', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },
  approveShop: async (shopId) => {
    return fetchWithAuth(`/super/shops/${shopId}/approve`, {
      method: 'POST',
    });
  },
  rejectShop: async (shopId) => {
    return fetchWithAuth(`/super/shops/${shopId}/reject`, {
      method: 'POST',
    });
  },
  disapproveShop: async (shopId) => {
    return fetchWithAuth(`/super/shops/${shopId}/disapprove`, {
      method: 'POST',
    });
  },
  deleteShop: async (shopId) => {
    return fetchWithAuth(`/super/shops/${shopId}`, {
      method: 'DELETE',
    });
  },
};
