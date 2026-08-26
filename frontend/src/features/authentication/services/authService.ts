import type { Doctor } from '../../../types';
import { http } from '../../../services/http';
import { config } from '../../../services/config';

export const authService = {
  login: async (emailOrHospitalId: string, password: string): Promise<{ success: boolean; doctor?: Doctor; error?: string }> => {
    try {
      const payload = {
        email: emailOrHospitalId,
        password: password
      };
      
      const res = await http.post<any>(`${config.apiUrl}/auth/login`, payload);
      const token = res.access_token || res.token || (res.data && (res.data.access_token || res.data.token));
      const user = res.user || (res.data && res.data.user);

      if (token && user) {
        localStorage.setItem('token', token);
        
        // Map backend user response to Doctor interface
        const doctor: Doctor = {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`,
          specialty: user.specialty || 'General Practitioner',
          department: user.specialty || 'Internal Medicine'
        };
        
        return {
          success: true,
          doctor
        };
      }
      
      return {
        success: false,
        error: res.message || 'Login failed'
      };
    } catch (err: any) {
      console.error('Login error:', err);
      const msg = err?.response?.data?.detail || err?.message || 'Invalid credentials. Check your email and password.';
      return {
        success: false,
        error: msg
      };
    }
  }
};
