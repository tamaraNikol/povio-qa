declare global {
  namespace PlaywrightTest {
    interface Matchers<R, T = unknown> {
      /**
       * Check if a campaign with the given title is visible on the page
       * @param title - Campaign title to search for
       * @example await expect(page).toHaveCampaignVisible('My Campaign')
       */
      toHaveCampaignVisible(title: string): R;

      /**
       * Check if a success message matching the pattern is shown
       * @param pattern - RegExp pattern to match against the flash message
       * @example await expect(page).toShowSuccessMessage(/created/i)
       */
      toShowSuccessMessage(pattern: RegExp): R;

      /**
       * Check if a flash/alert message is visible
       * @example await expect(page).toShowFlashMessage()
       */
      toShowFlashMessage(): R;
    }
  }
}

export {};



