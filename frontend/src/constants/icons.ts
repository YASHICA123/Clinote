import { 
  Activity, 
  Clock, 
  Pill, 
  TestTube, 
  FileText, 
  Stethoscope, 
  LogOut, 
  ShieldCheck,
  User,
  Settings
} from 'lucide-react';

export const ICONS = {
  OVERVIEW: Activity,
  TIMELINE: Clock,
  MEDICATIONS: Pill,
  INVESTIGATIONS: TestTube,
  REPORTS: FileText,
  COURSE: Stethoscope,
  DISCHARGE: LogOut,
  AUDIT: ShieldCheck,
  USER: User,
  SETTINGS: Settings,
} as const;
