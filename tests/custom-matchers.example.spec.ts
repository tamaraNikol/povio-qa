// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../playwright-custom-matchers.d.ts" />

import { test, expect } from '../fixtures/test-fixtures';
import { generateUser } from '../utils/api-helpers';

/**
 * Example tests demonstrating custom matchers usage
 * These patterns can be integrated into existing test files
 */
test.describe('Custom Matchers Example', () => {
  test('demonstrates toHaveCampaignVisible matcher', {
    tag: ['@example', '@low', '@campaigns'],
    annotation: {
      type: 'documentation',
      description: 'Example usage of toHaveCampaignVisible custom matcher',
    },
  }, async ({ page, testHelpers, campaignsPage }) => {
    const user = generateUser();
    await testHelpers.registerAndLogin(user);

    const campaignTitle = `Test Campaign ${Date.now()}`;

    // Navigate to campaigns and create new one
    await campaignsPage.goto();
    await campaignsPage.clickNewCampaign();
    await campaignsPage.fillCampaignForm(campaignTitle, 'Test description');
    await campaignsPage.submitForm();

    // Wait for redirect
    await expect(page).toHaveURL('/campaigns');

    // Use custom matcher instead of standard assertion
    // Traditional way:
    // await expect(page.locator(`text="${campaignTitle}"`).first()).toBeVisible({ timeout: 8000 });

    // Custom matcher way (more readable):
    await expect(page).toHaveCampaignVisible(campaignTitle);

    // Cleanup
    await testHelpers.deleteCurrentAccount();
  });

  test('demonstrates toShowSuccessMessage matcher', {
    tag: ['@example', '@low', '@campaigns'],
    annotation: {
      type: 'documentation',
      description: 'Example usage of toShowSuccessMessage custom matcher',
    },
  }, async ({ page, testHelpers, campaignsPage }) => {
    const user = generateUser();
    await testHelpers.registerAndLogin(user);

    await campaignsPage.goto();
    await campaignsPage.clickNewCampaign();
    await campaignsPage.fillCampaignForm('Success Test', 'Testing success message');
    await campaignsPage.submitForm();

    // Use custom matcher to check for success message
    await expect(page).toShowSuccessMessage(/created|success/i);

    // Cleanup
    await testHelpers.deleteCurrentAccount();
  });

  test('demonstrates toShowFlashMessage matcher', {
    tag: ['@example', '@low', '@campaigns'],
    annotation: {
      type: 'documentation',
      description: 'Example usage of toShowFlashMessage custom matcher',
    },
  }, async ({ page, testHelpers, campaignsPage }) => {
    const user = generateUser();
    await testHelpers.registerAndLogin(user);

    await campaignsPage.goto();
    await campaignsPage.clickNewCampaign();
    await campaignsPage.fillCampaignForm('Flash Test', 'Testing flash');
    await campaignsPage.submitForm();

    // Check if any flash message is shown
    await expect(page).toShowFlashMessage();

    // Cleanup
    await testHelpers.deleteCurrentAccount();
  });
});








