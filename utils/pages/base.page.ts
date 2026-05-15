import { Page } from '@playwright/test';
import { TIMEOUTS } from '../constants';
import { COMMON } from '../selectors';

export class BasePage {
  constructor(protected page: Page) {}

  async navigate(path: string): Promise<void> {
    await this.page.goto(path);
  }


  async signOut(): Promise<void> {
    const signOutLink = this.page.locator(COMMON.SIGN_OUT_LINK);
    const exists = await signOutLink.count();
    if (exists > 0) {
      await signOutLink.click();
      // Wait for redirect to home or sign-in page
      await this.page.waitForURL((url) => url.pathname === '/' || url.pathname.includes('sign_in'), { 
        timeout: TIMEOUTS.SHORT 
      }).catch(() => null);
    }
  }
}
