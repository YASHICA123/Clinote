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
      if (res.success && res.token) {
        localStorage.setItem('token', res.token);
        
        // Map backend user response to Doctor interface
        const doctor: Doctor = {
          id: res.user.id,
          name: res.user.name,
          email: res.user.email,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(res.user.name)}`,
          specialty: res.user.specialty || 'General Practitioner',
          department: res.user.specialty || 'Internal Medicine'
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
      console.error(err);
      return {
        success: false,
        error: 'Invalid credentials. Check your email and password.'
      };
    }
  }
};
