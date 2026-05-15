/**
 * Test Constants
 *
 * Centralized constants for test configuration to avoid magic numbers
 * and improve maintainability.
 */

/**
 * Timeout values in milliseconds for various wait operations
 */
export const TIMEOUTS = {
  /** Short timeout for quick operations (5 seconds) */
  SHORT: 5000,

  /** Medium timeout for standard operations (8 seconds) */
  MEDIUM: 8000,

  /** Long timeout for slow operations (10 seconds) */
  LONG: 10000,

  /** Extra long timeout for very slow operations (30 seconds) */
  EXTRA_LONG: 30000,
} as const;

/**
 * Base URLs for the application
 */
export const URLS = {
  BASE: 'https://povio-at.herokuapp.com',
  HOME: '/',
  SIGN_UP: '/users/sign_up',
  SIGN_IN: '/users/sign_in',
  CAMPAIGNS: '/campaigns',
  CAMPAIGNS_NEW: '/campaigns/new',
  USERS_EDIT: '/users/edit',
} as const;

/**
 * Test data constants
 */
export const TEST_DATA = {
  DEFAULT_PASSWORD: 'Password123!',
  EMAIL_DOMAIN: '@mailinator.com',
} as const;

