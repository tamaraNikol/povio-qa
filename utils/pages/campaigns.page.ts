import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { CAMPAIGNS } from '../selectors';

export class CampaignsPage extends BasePage {
  private readonly newCampaignLink = this.page.locator(CAMPAIGNS.NEW_CAMPAIGN_LINK);
  private readonly campaignTitleInput = this.page.locator(CAMPAIGNS.TITLE_INPUT);
  private readonly campaignDescInput = this.page.locator(CAMPAIGNS.DESCRIPTION_INPUT);
  private readonly submitButton = this.page.locator(CAMPAIGNS.SUBMIT_BUTTON);

  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.navigate('/campaigns');
  }

  async clickNewCampaign(): Promise<void> {
    await this.newCampaignLink.click();
    await expect(this.page).toHaveURL(/campaigns\/new/);
  }

  async fillCampaignForm(title: string, description: string): Promise<void> {
    await this.campaignTitleInput.fill(title);
    await this.campaignDescInput.fill(description);
  }

  async submitForm(): Promise<void> {
    await this.submitButton.click();
  }

  async getCampaignByTitle(title: string): Promise<ReturnType<Page['locator']>> {
    return this.page.locator(`text="${title}"`).first();
  }

  async clickEditOnCampaign(title: string): Promise<void> {
    // Find the row/card containing this title and click its Edit link
    const row = this.page.locator(CAMPAIGNS.CAMPAIGN_ROW).filter({ hasText: title }).first();
    await row.locator(CAMPAIGNS.EDIT_LINK).click();
  }
}
