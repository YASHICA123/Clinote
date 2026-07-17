export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PATIENT_WORKSPACE: '/patient-workspace',
  SETTINGS: '/settings',
} as const;

export type RouteType = typeof ROUTES[keyof typeof ROUTES];
