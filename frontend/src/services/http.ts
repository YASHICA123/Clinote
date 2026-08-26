/**
 * Simple HTTP client utility wrapper around fetch API
 */
export const http = {
  getHeaders(options?: RequestInit): HeadersInit {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return {
      ...headers,
      ...(options?.headers || {})
    };
  },

  unwrap<T>(json: any): T {
    if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
      return json.data as T;
    }
    return json as T;
  },

  async get<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url, { 
      method: 'GET', 
      ...options,
      headers: this.getHeaders(options)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || err.message || `HTTP GET failed: ${res.statusText}`);
    }
    const json = await res.json();
    return this.unwrap<T>(json);
  },

  async post<T>(url: string, data: any, options?: RequestInit): Promise<T> {
    const headers = this.getHeaders(options) as Record<string, string>;
    const isFormData = data instanceof FormData;
    
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: isFormData ? data : JSON.stringify(data),
      ...options,
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(json.detail || json.message || `HTTP POST failed: ${res.statusText}`);
    }
    return this.unwrap<T>(json);
  },

  async put<T>(url: string, data: any, options?: RequestInit): Promise<T> {
    const headers = this.getHeaders(options) as Record<string, string>;
    const isFormData = data instanceof FormData;

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(url, {
      method: 'PUT',
      headers,
      body: isFormData ? data : JSON.stringify(data),
      ...options,
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(json.detail || json.message || `HTTP PUT failed: ${res.statusText}`);
    }
    return this.unwrap<T>(json);
  },

  async patch<T>(url: string, data: any, options?: RequestInit): Promise<T> {
    const headers = this.getHeaders(options) as Record<string, string>;
    const isFormData = data instanceof FormData;

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(url, {
      method: 'PATCH',
      headers,
      body: isFormData ? data : JSON.stringify(data),
      ...options,
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(json.detail || json.message || `HTTP PATCH failed: ${res.statusText}`);
    }
    return this.unwrap<T>(json);
  },

  async delete<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url, { 
      method: 'DELETE', 
      ...options,
      headers: this.getHeaders(options)
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(json.detail || json.message || `HTTP DELETE failed: ${res.statusText}`);
    }
    return this.unwrap<T>(json);
  },
};
