import { test, expect } from '@playwright/test';

test.describe('Health Check', () => {
  test('app homepage is reachable and renders correctly', {
    tag: ['@smoke', '@critical', '@health-check'],
    annotation: {
      type: 'description',
      description: 'Validates basic application availability and critical UI elements',
    },
  }, async ({ page }) => {
    const response = await page.goto('/');

    // HTTP level: 200
    expect(response?.status()).toBe(200);

    // Page has a title
    await expect(page).toHaveTitle(/Povio/i);

    // Navigation is visible
    await expect(page.locator('nav, .navbar')).toBeVisible();

    // Sign in / Sign up links exist (proves app is functioning, not just a static error page)
    await expect(page.locator('a[href*="sign_in"]')).toBeVisible();
    await expect(page.locator('a[href*="sign_up"]')).toBeVisible();
  });
});
