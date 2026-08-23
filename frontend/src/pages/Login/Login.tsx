import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { authService } from '../../features/authentication/services/authService';
import { ClinoteLogo } from '../../components/ui/ClinoteLogo';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export const Login: React.FC = () => {
  const { setCurrentPage, setCurrentUser } = useApp();
  const [email, setEmail] = useState('deepak.bhasin@clinote.com');
  const [password, setPassword] = useState('password123');
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans relative overflow-hidden">
      {/* Background soft gradients */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-emerald-50/50 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vh] bg-teal-50/30 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Panel: Information & Branding */}
          <div className="space-y-8 text-left hidden md:block">
            <div className="flex items-center gap-3 cursor-pointer">
              <ClinoteLogo size={44} />
              <div>
                <h1 className="font-extrabold text-2xl leading-none tracking-tight">
                  <span className="text-slate-900">CLI</span>
                  <span className="text-emerald-600">NOTE</span>
                </h1>
                <span className="text-xs text-emerald-600 font-semibold tracking-wide uppercase">Clinical Intelligence</span>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Intelligent Insights.<br />
                <span className="text-emerald-600">Better Medical Care.</span>
              </h2>
              <p className="text-slate-500 text-xs leading-relaxed max-w-sm">
                CLINOTE empowers clinicians with real-time insights, streamlined documentation, and intelligent automation for better patient outcomes.
              </p>
            </div>

            {/* Compliance Banner */}
            <div className="bg-emerald-50/80 border border-emerald-100 rounded-2xl p-4 max-w-sm flex gap-3.5 items-start">
              <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-sm shadow-emerald-600/10">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h4 className="font-bold text-[11px] text-emerald-800 tracking-wide uppercase">Secure. Private. Compliant.</h4>
                <p className="text-[10px] text-emerald-700/80 mt-0.5 leading-normal">
                  Your data is protected with enterprise-grade security and HIPAA compliance.
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel: Login Card */}
          <div className="flex justify-center md:justify-end">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-100/60 border border-slate-100 p-8 md:p-10 space-y-6">
              
              {/* Header inside Card */}
              <div className="text-center space-y-2">
                <div className="inline-flex p-3 bg-emerald-50 rounded-2xl mb-1 text-emerald-600">
                  <ClinoteLogo size={40} />
                </div>
                <h3 className="font-extrabold text-xl text-slate-900">Welcome Back, Doctor 🩺</h3>
                <p className="text-[11px] text-slate-400">Login to continue to your dashboard</p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium">
                    {error}
                  </div>
                )}

                <Input
                  label="Email Address or Hospital ID"
                  placeholder="Enter your email or hospital ID"
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

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 text-slate-500 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                      defaultChecked
                    />
                    <span>Remember me</span>
                  </label>
                  <button type="button" className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline">
                    Forgot Password?
                  </button>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-3 text-xs bg-emerald-700 hover:bg-emerald-800 font-semibold tracking-wide mt-2"
                  loading={loading}
                >
                  Login
                </Button>
              </form>

              {/* Footer inside Card */}
              <p className="text-[10px] text-slate-400 text-center">
                Need help? <button type="button" className="text-emerald-600 font-medium hover:underline inline">Contact your IT administrator</button> or support team.
              </p>

            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-100 text-center text-[10px] text-slate-400 flex flex-col sm:flex-row justify-center items-center gap-3">
        <span>© 2026 CLINOTE Clinical Intelligence. All rights reserved.</span>
        <span className="hidden sm:inline">|</span>
        <div className="flex gap-4">
          <button type="button" className="hover:text-slate-600 transition-colors">Privacy Policy</button>
          <button type="button" className="hover:text-slate-600 transition-colors">Terms of Use</button>
          <button type="button" className="hover:text-slate-600 transition-colors">Support</button>
        </div>
      </footer>
    </div>
  );
};
