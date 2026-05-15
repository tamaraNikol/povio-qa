import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { TIMEOUTS } from '../constants';
import { REGISTER } from '../selectors';

export class RegisterPage extends BasePage {
  private readonly nameInput = this.page.locator(REGISTER.NAME_INPUT);
  private readonly emailInput = this.page.locator(REGISTER.EMAIL_INPUT);
  private readonly passwordInput = this.page.locator(REGISTER.PASSWORD_INPUT);
  private readonly passwordConfirmInput = this.page.locator(REGISTER.PASSWORD_CONFIRM);
  private readonly submitButton = this.page.locator(REGISTER.SUBMIT_BUTTON);
  private readonly errorMessages = this.page.locator(REGISTER.ERROR_MESSAGES);

  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.navigate('/users/sign_up');
    await expect(this.page).toHaveURL(/sign_up/);
  }

  async register(name: string, email: string, password: string): Promise<void> {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.passwordConfirmInput.fill(password);
    await this.submitButton.click();
  }

  async getErrors(): Promise<string> {
    await this.errorMessages.first().waitFor({ timeout: TIMEOUTS.SHORT }).catch(() => null);
    return (await this.errorMessages.first().textContent()) ?? '';
  }
}
