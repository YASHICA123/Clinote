import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { authService } from '../../features/authentication/services/authService';
import { ClinoteLogo } from '../../components/ui/ClinoteLogo';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export const Login: React.FC = () => {
  const { setCurrentPage, setCurrentUser } = useApp();
  const [email, setEmail] = useState('doctor@clinote.ai');
  const [password, setPassword] = useState('doctor123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authService.login(email, password);
      if (res.success && res.doctor) {
        setCurrentUser(res.doctor);
        setCurrentPage('dashboard');
      } else {
        setError(res.error || 'Authentication failed');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans relative overflow-hidden text-left">
      {/* Background soft emerald gradients */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-emerald-50/60 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vh] bg-teal-50/40 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Panel: Information & Branding */}
          <div className="space-y-8 text-left hidden md:block">
            <div className="flex items-center gap-3 cursor-pointer">
              <ClinoteLogo size={44} />
              <div>
                <h1 className="font-black text-2xl leading-none tracking-tight">
                  <span className="text-slate-900">CLI</span>
                  <span className="text-emerald-600">NOTE</span>
                </h1>
                <span className="text-xs text-emerald-600 font-bold tracking-wide uppercase">Clinical Platform • Phase 1</span>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Solid Clinical Foundation.<br />
                <span className="text-emerald-600">Built for Modern Doctors.</span>
              </h2>
              <p className="text-slate-500 text-xs leading-relaxed max-w-sm font-medium">
                Comprehensive patient management, encounter tracking, manual clinical notes, and chronological timeline records.
              </p>
            </div>

            {/* Compliance Banner */}
            <div className="bg-emerald-50/80 border border-emerald-100 rounded-2xl p-4 max-w-sm flex gap-3.5 items-start">
              <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-sm shadow-emerald-600/10">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h4 className="font-bold text-[11px] text-emerald-950 tracking-wide uppercase">Secure & Audited</h4>
                <p className="text-[10px] text-emerald-800/80 mt-0.5 leading-normal">
                  Standard JWT authentication, encrypted credentials, and comprehensive write-action audit logging.
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel: Login Card */}
          <div className="flex justify-center md:justify-end">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-100/60 border border-slate-200 p-8 md:p-10 space-y-6">
              
              {/* Header inside Card */}
              <div className="text-center space-y-2">
                <div className="inline-flex p-3 bg-emerald-50 rounded-2xl mb-1 text-emerald-600">
                  <ClinoteLogo size={40} />
                </div>
                <h3 className="font-black text-xl text-slate-900">Welcome to Clinote 🩺</h3>
                <p className="text-xs text-slate-400">Sign in to your clinical account</p>
              </div>

              {/* Quick Demo Accounts */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
                  Quick Demo Clinicians:
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('doctor@clinote.ai', 'doctor123')}
                    className="p-1.5 bg-white border border-slate-200 hover:border-emerald-500 rounded-xl text-slate-700 font-bold transition-all text-center"
                  >
                    Dr. Sarah Paul
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('dr.bhasin@clinote.ai', 'doctor123')}
                    className="p-1.5 bg-white border border-slate-200 hover:border-emerald-500 rounded-xl text-slate-700 font-bold transition-all text-center"
                  >
                    Dr. Deepak Bhasin
                  </button>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium">
                    {error}
                  </div>
                )}

                <Input
                  label="Email Address"
                  placeholder="e.g. doctor@clinote.ai"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail size={15} />}
                  required
                />

                <div className="space-y-1">
                  <div className="relative">
                    <Input
                      label="Password"
                      placeholder="Enter your password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      icon={<Lock size={15} />}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-[30px] text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-3 text-xs bg-emerald-600 hover:bg-emerald-700 font-bold tracking-wide mt-2 shadow-sm shadow-emerald-600/20"
                  loading={loading}
                >
                  Sign In to Dashboard
                </Button>
              </form>

              <p className="text-[10px] text-slate-400 text-center">
                Hospital deployment or access issues? <span className="text-emerald-600 font-semibold cursor-pointer">Contact System Admin</span>
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-100 text-center text-[10px] text-slate-400 flex flex-col sm:flex-row justify-center items-center gap-3">
        <span>© 2026 CLINOTE Clinical Intelligence. All rights reserved.</span>
        <span className="hidden sm:inline">|</span>
        <span>Phase 1: Foundation</span>
      </footer>
    </div>
  );
};
