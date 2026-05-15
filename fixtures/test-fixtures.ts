import { test as base } from '@playwright/test';
import { TestHelpers } from './test-helpers';
import { RegisterPage } from '../utils/pages/register.page';
import { LoginPage } from '../utils/pages/login.page';
import { CampaignsPage } from '../utils/pages/campaigns.page';
import { setupCustomMatchers } from '../utils/matchers/custom-matchers';

// Initialize custom matchers once when fixtures are loaded
setupCustomMatchers();

/**
 * Custom test fixtures that extend Playwright's base test.
 * Provides pre-configured page objects and helpers for all tests.
 */
type TestFixtures = {
  testHelpers: TestHelpers;
  registerPage: RegisterPage;
  loginPage: LoginPage;
  campaignsPage: CampaignsPage;
};

export const test = base.extend<TestFixtures>({
  testHelpers: async ({ page }, use) => {
    await use(new TestHelpers(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  campaignsPage: async ({ page }, use) => {
    await use(new CampaignsPage(page));
  },
});

export { expect } from '@playwright/test';

