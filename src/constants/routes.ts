/**
 * central source of truth for all application route paths.
 * Use these constants instead of inline strings for navigation.
 */
export const ROUTES = {
  HOME: '/',
  OPD: {
    ROOT: '/opd',
    WIZARD: '/opd/wizard',
    CARD: '/opd/card',
    SUCCESS: '/opd/success',
  },
  ADMIN: {
    DASHBOARD: '/admin',
    PATIENTS: '/admin/patients',
  },
} as const;

export type AppRoutes = typeof ROUTES;
