import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  User,
  Settings as SettingsIcon,
  Database,
  Bell,
  Check,
  Server,
  Lock
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { currentUser } = useApp();
  const [name, setName] = useState(currentUser?.name || 'Dr. Deepak Bhasin');
  const [email, setEmail] = useState(currentUser?.email || 'deepak.bhasin@clinote.com');
  const [specialty, setSpecialty] = useState(currentUser?.specialty || 'Senior Consultant, Pulmonology');

  // Integration states
  const [apiUrl, setApiUrl] = useState('http://localhost:8000/api/v1');
  const [supabaseUrl, setSupabaseUrl] = useState('https://jghqbsyghswygvfywsgy.supabase.co');
  const [supabaseKey, setSupabaseKey] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockkey...');

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 800);
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <div className="space-y-1">
        <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
          <SettingsIcon size={18} className="text-emerald-700" />
          System Settings
        </h2>
        <p className="text-[11px] text-slate-400 font-medium">Manage your profile, system behavior, and API integrations</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* Clinician Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={15} className="text-slate-500" />
              Clinician Profile Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                icon={<User size={13} />}
                required
              />
              <Input
                label="Specialty / Designation"
                value={specialty}
                onChange={e => setSpecialty(e.target.value)}
                required
              />
            </div>
            <Input
              label="Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
              disabled
              icon={<Lock size={13} />}
            />
            <p className="text-[9px] text-slate-400">
              Email addresses are locked to the clinical SSO. Contact your system admin to modify.
            </p>
          </CardContent>
        </Card>

        {/* Integration Parameters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database size={15} className="text-slate-500" />
              FastAPI & Supabase Integration (Future Ready)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-emerald-50/50 border border-emerald-150 rounded-2xl p-4 flex gap-3 items-start">
              <Server size={18} className="text-emerald-700 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs text-emerald-800">API Connection Status</h4>
                <p className="text-[10px] text-emerald-700/80 mt-0.5 leading-normal">
                  The client application is running in **Mock Environment** mode. Below parameters are preconfigured to enable seamless connection when API endpoints are live.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <Input
                label="FastAPI Base URL"
                value={apiUrl}
                onChange={e => setApiUrl(e.target.value)}
                placeholder="http://localhost:8000"
              />

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Supabase Endpoint URL"
                  value={supabaseUrl}
                  onChange={e => setSupabaseUrl(e.target.value)}
                  placeholder="https://yourproject.supabase.co"
                />
                <Input
                  label="Supabase Anonymous Key"
                  value={supabaseKey}
                  onChange={e => setSupabaseKey(e.target.value)}
                  type="password"
                  placeholder="eyJhb..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell size={15} className="text-slate-500" />
              Application Notifications & Voice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center justify-between text-xs p-3 border border-slate-100 rounded-xl hover:bg-slate-50/50 cursor-pointer select-none">
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-800">Critical Lab Alerts</p>
                  <p className="text-[9px] text-slate-400">Play an audible warning when labs exceed critical thresholds</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300" />
              </label>

              <label className="flex items-center justify-between text-xs p-3 border border-slate-100 rounded-xl hover:bg-slate-50/50 cursor-pointer select-none">
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-800">Voice Transcription Assist</p>
                  <p className="text-[9px] text-slate-400">Optimize local audio buffers for medical vocabulary models</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300" />
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="flex justify-end gap-3 items-center">
          {saveSuccess && (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
              <Check size={14} />
              Settings saved successfully!
            </span>
          )}
          <Button
            type="submit"
            variant="primary"
            loading={saving}
            className="px-6 bg-emerald-700 hover:bg-emerald-800"
          >
            Save Changes
          </Button>
        </div>

      </form>
    </div>
  );
};
