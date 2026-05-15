import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { TIMEOUTS } from '../constants';
import { LOGIN } from '../selectors';

export class LoginPage extends BasePage {
  private readonly emailInput = this.page.locator(LOGIN.EMAIL_INPUT);
  private readonly passwordInput = this.page.locator(LOGIN.PASSWORD_INPUT);
  private readonly submitButton = this.page.locator(LOGIN.SUBMIT_BUTTON);

  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.navigate('/users/sign_in');
    await expect(this.page).toHaveURL(/sign_in/);
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async loginAndWait(email: string, password: string): Promise<void> {
    await this.login(email, password);
    // Wait for redirect away from sign_in
    await this.page.waitForURL((url) => !url.pathname.includes('sign_in'), { timeout: TIMEOUTS.LONG });
  }
}
