import { ROUTES } from '../constants/routes';

export interface NavItem {
  label: string;
  path: string;
  icon?: string;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD },
  { label: 'Patient Workspace', path: ROUTES.PATIENT_WORKSPACE },
  { label: 'Settings', path: ROUTES.SETTINGS },
];
