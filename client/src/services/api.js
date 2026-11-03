const API_BASE = '/api';

export const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return url;
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('foundit_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // ---------------- AUTH ----------------
  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  async login(credentials) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeaders() },
    });
    if (!res.ok) throw new Error('Session expired');
    return res.json();
  },

  // ---------------- ITEMS ----------------
  async getItems({ category, search, status } = {}) {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search && search.trim()) params.append('search', search.trim());
    if (status) params.append('status', status);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE}/items${queryString}`, {
      headers: { ...getAuthHeaders() },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch items');
    }
    return res.json();
  },

  // Upload item (Admin exclusive)
  async createItem(formData) {
    const res = await fetch(`${API_BASE}/items`, {
      method: 'POST',
      headers: { ...getAuthHeaders() },
      body: formData,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Failed to upload found item');
    return data;
  },

  // Delete item (Admin exclusive)
  async deleteItem(id) {
    const res = await fetch(`${API_BASE}/items/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Failed to delete item');
    return data;
  },

  // ---------------- CLAIMS ----------------
  // Submit official student claim (Student exclusive)
  async submitClaim({ itemId, studentName, registrationNumber, department }) {
    const res = await fetch(`${API_BASE}/claims`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        itemId,
        studentName,
        registrationNumber,
        department,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Failed to submit claim request');
    return data;
  },

  // Approve or Reject claim (Admin exclusive)
  async updateClaimStatus(id, status) {
    const res = await fetch(`${API_BASE}/claims/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ status }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `Failed to ${status} claim`);
    return data;
  },

  // Get all claims (Admin or Student)
  async getClaims(itemId) {
    const query = itemId ? `?itemId=${itemId}` : '';
    const res = await fetch(`${API_BASE}/claims${query}`, {
      headers: { ...getAuthHeaders() },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Failed to fetch claims');
    return data;
  },

  // ---------------- ADMIN MODULE ----------------
  async getAdminStats() {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: { ...getAuthHeaders() },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Failed to fetch admin stats');
    return data;
  },

  async getAdminUsers() {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: { ...getAuthHeaders() },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Failed to fetch users');
    return data;
  },

  async updateAdminUserRole(id, role) {
    const res = await fetch(`${API_BASE}/admin/users/${id}/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ role }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Failed to update user role');
    return data;
  },

  async getAdminItems() {
    const res = await fetch(`${API_BASE}/admin/items`, {
      headers: { ...getAuthHeaders() },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Failed to fetch all items');
    return data;
  },

  async toggleAdminItemFlag(id, isFlagged) {
    const res = await fetch(`${API_BASE}/admin/items/${id}/flag`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ isFlagged }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Failed to toggle item flag');
    return data;
  },
};
