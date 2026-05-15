import { expect, Page } from '@playwright/test';

/**
 * Custom Playwright matchers for domain-specific assertions
 */
export function setupCustomMatchers(): void {
  expect.extend({
    /**
     * Check if a campaign with the given title is visible on the page
     * @param page - Playwright Page object
     * @param title - Campaign title to search for
     */
    async toHaveCampaignVisible(page: Page, title: string) {
      const locator = page.locator(`text="${title}"`).first();
      const isVisible = await locator.isVisible({ timeout: 5000 }).catch(() => false);

      return {
        message: (): string => isVisible
          ? `expected campaign "${title}" not to be visible`
          : `expected campaign "${title}" to be visible`,
        pass: isVisible,
      };
    },

    /**
     * Check if a success message matching the pattern is shown
     * @param page - Playwright Page object
     * @param pattern - RegExp pattern to match against the flash message
     */
    async toShowSuccessMessage(page: Page, pattern: RegExp) {
      const flash = page.locator('.alert, .notice, [class*="flash"]');
      const text = await flash.textContent().catch(() => '');
      const matches = pattern.test(text || '');

      return {
        message: (): string => matches
          ? `expected success message not to match ${pattern}`
          : `expected success message to match ${pattern}, but got: "${text}"`,
        pass: matches,
      };
    },

    /**
     * Check if a flash/alert message is visible
     * @param page - Playwright Page object
     */
    async toShowFlashMessage(page: Page) {
      const flash = page.locator('.alert, .notice, [class*="flash"]');
      const isVisible = await flash.isVisible({ timeout: 3000 }).catch(() => false);

      return {
        message: (): string => isVisible
          ? 'expected flash message not to be visible'
          : 'expected flash message to be visible',
        pass: isVisible,
      };
    },
  });
}


