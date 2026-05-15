import { Page } from '@playwright/test';
import { RegisterPage } from '../utils/pages/register.page';
import { LoginPage } from '../utils/pages/login.page';
import { ACCOUNT } from '../utils/selectors';

/**
 * TestHelpers class provides reusable helper methods for common test operations.
 * This eliminates code duplication across test files.
 */
export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Registers a new user and logs them in if needed.
   * Handles the case where the app redirects to sign_in after registration.
   */
  async registerAndLogin(user: { name: string; email: string; password: string }): Promise<void> {
    const registerPage = new RegisterPage(this.page);
    const loginPage = new LoginPage(this.page);

    await registerPage.goto();
    await registerPage.register(user.name, user.email, user.password);

    // If redirected to sign_in (some apps require email confirmation)
    if (this.page.url().includes('sign_in')) {
      await loginPage.loginAndWait(user.email, user.password);
    }
  }

  /**
   * Deletes the currently logged-in user's account via the UI.
   * Used as cleanup after tests that create user accounts.
   */
  async deleteCurrentAccount(): Promise<void> {
    await this.page.goto('/users/edit');
    const deleteBtn = this.page.locator(ACCOUNT.DELETE_ACCOUNT_BUTTON);
    const exists = await deleteBtn.count();
    if (exists > 0) {
      this.page.once('dialog', (dialog) => dialog.accept());
      await deleteBtn.click();
    }
  }
}


