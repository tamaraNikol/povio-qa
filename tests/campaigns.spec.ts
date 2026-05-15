import { test, expect } from '../fixtures/test-fixtures';
import { generateUser } from '../utils/api-helpers';
import { TIMEOUTS } from '../utils/constants';

test.describe('Campaigns', () => {
  let user: { name: string; email: string; password: string };

  test.beforeEach(async ({ testHelpers }) => {
    user = generateUser();
    await testHelpers.registerAndLogin(user);
  });

  test.afterEach(async ({ testHelpers }) => {
    await testHelpers.deleteCurrentAccount();
  });

  test('logged-in user can add a new campaign', {
    tag: ['@smoke', '@critical', '@campaigns', '@crud'],
    annotation: {
      type: 'feature',
      description: 'Campaign creation - happy path',
    },
  }, async ({ campaignsPage, page }) => {
    const title = `Campaign ${Date.now()}`;
    const description = 'Automated test campaign description';

    await campaignsPage.goto();
    await campaignsPage.clickNewCampaign();

    await campaignsPage.fillCampaignForm(title, description);
    await campaignsPage.submitForm();

    // After creation, should redirect to campaign list or show page
    await expect(page).not.toHaveURL(/campaigns\/new/);

    // The new campaign title should be visible
    await expect(page.locator(`text="${title}"`).first()).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
  });

  test('logged-in user can edit an existing campaign', {
    tag: ['@smoke', '@critical', '@campaigns', '@crud'],
    annotation: {
      type: 'feature',
      description: 'Campaign update functionality',
    },
  }, async ({ campaignsPage, page }) => {
    const originalTitle = `Campaign ${Date.now()}`;
    const updatedTitle = `Updated ${originalTitle}`;

    // --- Setup: create campaign first ---
    await campaignsPage.goto();
    await campaignsPage.clickNewCampaign();
    await campaignsPage.fillCampaignForm(originalTitle, 'Original description');
    await campaignsPage.submitForm();
    await expect(page.locator(`text="${originalTitle}"`).first()).toBeVisible({ timeout: TIMEOUTS.MEDIUM });

    // --- Act: edit the campaign ---
    await campaignsPage.goto();
    await campaignsPage.clickEditOnCampaign(originalTitle);

    await expect(page).toHaveURL(/edit/);

    await campaignsPage.fillCampaignForm(updatedTitle, 'Updated description');
    await campaignsPage.submitForm();

    // Updated title should now appear
    await expect(page.locator(`text="${updatedTitle}"`).first()).toBeVisible({ timeout: TIMEOUTS.MEDIUM });

    // Original title should no longer appear
    await expect(page.locator(`text="${originalTitle}"`)).toHaveCount(0);
  });
});
