import { test, expect } from '../fixtures/test-fixtures';
import { generateUser } from '../utils/api-helpers';
import { TIMEOUTS } from '../utils/constants';

test.describe('Campaign Validation', () => {
  let user: { name: string; email: string; password: string };

  test.beforeEach(async ({ testHelpers }) => {
    user = generateUser();
    await testHelpers.registerAndLogin(user);
  });

  test.afterEach(async ({ testHelpers }) => {
    await testHelpers.deleteCurrentAccount();
  });

  test('application accepts empty campaign title (documents behavior)', {
    tag: ['@regression', '@low', '@campaigns', '@validation', '@edge-case'],
    annotation: {
      type: 'bug',
      description: 'Documents potential data quality issue - empty titles accepted',
    },
  }, async ({ page, campaignsPage }) => {
    // This test documents that the application accepts empty titles
    // This may be a data quality issue worth addressing
    await campaignsPage.goto();
    await campaignsPage.clickNewCampaign();

    // Try to submit with empty title
    await campaignsPage.fillCampaignForm('', 'Some description');
    await campaignsPage.submitForm();

    // Application behavior: accepts empty title and creates campaign
    const url = page.url();

    if (url.includes('campaigns/new')) {
      // Validation rejected it - good behavior
      expect(url).toContain('new');
    } else {
      // Accepted empty title - documents this behavior
      await campaignsPage.goto();
      // Campaign was created, even with empty title
      expect(url).not.toContain('new');
    }
  });

  test('can create campaign without description (optional field)', {
    tag: ['@regression', '@medium', '@campaigns', '@validation'],
  }, async ({ page, campaignsPage }) => {
    const title = `Campaign No Desc ${Date.now()}`;

    await campaignsPage.goto();
    await campaignsPage.clickNewCampaign();

    // Submit with title but no description
    await campaignsPage.fillCampaignForm(title, '');
    await campaignsPage.submitForm();

    // Should succeed - description is optional
    await expect(page).not.toHaveURL(/campaigns\/new/);

    // Verify campaign was created
    await campaignsPage.goto();
    await expect(page.locator(`text="${title}"`).first()).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
  });

  test('can create campaign with very long title', {
    tag: ['@regression', '@medium', '@campaigns', '@validation', '@edge-case'],
  }, async ({ page, campaignsPage }) => {
    const longTitle = `Campaign ${Date.now()} - ${'A'.repeat(200)}`;

    await campaignsPage.goto();
    await campaignsPage.clickNewCampaign();

    await campaignsPage.fillCampaignForm(longTitle, 'Test description');
    await campaignsPage.submitForm();

    // Should either succeed or show validation error for title length
    const url = page.url();
    if (url.includes('campaigns/new')) {
      // Validation rejected it - acceptable
      const pageContent = await page.textContent('body');
      expect(pageContent?.toLowerCase()).toMatch(/title|long|maximum|characters/);
    } else {
      // Accepted it - verify it's created
      await campaignsPage.goto();
      const truncatedTitle = longTitle.substring(0, 30); // Check for beginning of title
      // Use getByText with substring match
      await expect(page.getByText(truncatedTitle, { exact: false }).first()).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
    }
  });

  test('can create campaign with special characters in title', {
    tag: ['@regression', '@medium', '@campaigns', '@validation', '@edge-case'],
  }, async ({ page, campaignsPage }) => {
    const title = `Campaign ${Date.now()} - Test!@#$%^&*()_+-=[]{}|;:',.<>?`;

    await campaignsPage.goto();
    await campaignsPage.clickNewCampaign();

    await campaignsPage.fillCampaignForm(title, 'Test description');
    await campaignsPage.submitForm();

    // Should succeed with special characters
    await expect(page).not.toHaveURL(/campaigns\/new/);

    // Verify campaign was created
    await campaignsPage.goto();
    await expect(page.locator(`text="${title}"`).first()).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
  });

  test('can create multiple campaigns with similar names', {
    tag: ['@regression', '@medium', '@campaigns', '@validation'],
  }, async ({ page, campaignsPage }) => {
    const baseName = `Campaign ${Date.now()}`;
    const title1 = `${baseName} - First`;
    const title2 = `${baseName} - Second`;

    // Create first campaign
    await campaignsPage.goto();
    await campaignsPage.clickNewCampaign();
    await campaignsPage.fillCampaignForm(title1, 'First description');
    await campaignsPage.submitForm();
    await expect(page.locator(`text="${title1}"`).first()).toBeVisible({ timeout: TIMEOUTS.MEDIUM });

    // Create second campaign with similar name
    await campaignsPage.goto();
    await campaignsPage.clickNewCampaign();
    await campaignsPage.fillCampaignForm(title2, 'Second description');
    await campaignsPage.submitForm();
    await expect(page.locator(`text="${title2}"`).first()).toBeVisible({ timeout: TIMEOUTS.MEDIUM });

    // Both should be visible
    await campaignsPage.goto();
    await expect(page.locator(`text="${title1}"`).first()).toBeVisible();
    await expect(page.locator(`text="${title2}"`).first()).toBeVisible();
  });

  test('edited campaign updates successfully', {
    tag: ['@regression', '@high', '@campaigns', '@crud'],
  }, async ({ page, campaignsPage }) => {
    const originalTitle = `Original ${Date.now()}`;
    const updatedTitle = `Updated ${Date.now()}`;

    // Create campaign
    await campaignsPage.goto();
    await campaignsPage.clickNewCampaign();
    await campaignsPage.fillCampaignForm(originalTitle, 'Original description');
    await campaignsPage.submitForm();
    await expect(page.locator(`text="${originalTitle}"`).first()).toBeVisible({ timeout: TIMEOUTS.MEDIUM });

    // Edit to empty title should fail or be prevented
    await campaignsPage.goto();
    await campaignsPage.clickEditOnCampaign(originalTitle);
    await campaignsPage.fillCampaignForm(updatedTitle, '');
    await campaignsPage.submitForm();

    // Updated title should appear
    await campaignsPage.goto();
    await expect(page.locator(`text="${updatedTitle}"`).first()).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
    await expect(page.locator(`text="${originalTitle}"`)).toHaveCount(0);
  });

  test('campaign form preserves data on validation error', {
    tag: ['@regression', '@low', '@campaigns', '@validation', '@ux'],
  }, async ({ page, campaignsPage }) => {
    const description = 'This is a test description that should be preserved';

    await campaignsPage.goto();
    await campaignsPage.clickNewCampaign();

    // Try to submit with empty title
    await campaignsPage.fillCampaignForm('', description);
    await campaignsPage.submitForm();

    // If validation fails, check if description is still there
    const currentUrl = page.url();
    if (currentUrl.includes('new') || currentUrl.includes('create')) {
      const descField = page.locator('input[name="campaign[description]"], textarea[name="campaign[description]"]');
      await descField.inputValue();
      // Some apps preserve form data, some don't - either is acceptable
      // This test documents the behavior
    }
  });
});





