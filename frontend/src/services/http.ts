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
    if (!res.ok) throw new Error(`HTTP GET failed: ${res.statusText}`);
    const json = await res.json();
    return this.unwrap<T>(json);
  },

  async post<T>(url: string, data: any, options?: RequestInit): Promise<T> {
    const headers = this.getHeaders(options);
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(data),
      ...options,
    });
    if (!res.ok) throw new Error(`HTTP POST failed: ${res.statusText}`);
    const json = await res.json();
    return this.unwrap<T>(json);
  },

  async put<T>(url: string, data: any, options?: RequestInit): Promise<T> {
    const headers = this.getHeaders(options);
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(data),
      ...options,
    });
    if (!res.ok) throw new Error(`HTTP PUT failed: ${res.statusText}`);
    const json = await res.json();
    return this.unwrap<T>(json);
  },

  async patch<T>(url: string, data: any, options?: RequestInit): Promise<T> {
    const headers = this.getHeaders(options);
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(data),
      ...options,
    });
    if (!res.ok) throw new Error(`HTTP PATCH failed: ${res.statusText}`);
    const json = await res.json();
    return this.unwrap<T>(json);
  },

  async delete<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url, { 
      method: 'DELETE', 
      ...options,
      headers: this.getHeaders(options)
    });
    if (!res.ok) throw new Error(`HTTP DELETE failed: ${res.statusText}`);
    const json = await res.json();
    return this.unwrap<T>(json);
  },
};
