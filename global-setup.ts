import { setupCustomMatchers } from './utils/matchers/custom-matchers';

/**
 * Global setup file for Playwright tests
 * This is executed once before all tests
 */
export default function globalSetup(): void {
  // Initialize custom matchers
  setupCustomMatchers();
}


