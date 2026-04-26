import { Page,expect } from "@playwright/test";

export class Yopmail {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto('https://yopmail.com/en/');


  }

  async enterEmail(email: string) {
    await this.page.getByRole('textbox', { name: 'Login' }).fill(email);
    console.log('Waiting 20 seconds for system to trigger email');
    await this.page.waitForTimeout(20000)
    await this.page.getByRole('button', { name: '' }).click();
  }

  async openLatestEmail() {
    const inboxFrame = this.page.frameLocator('#ifinbox');

    for (let i = 0; i < 5; i++) {
      const emails = await inboxFrame.locator('div.m').count();

      if (emails > 0) {
        await inboxFrame.locator('div.m').first().click();
        return;
      }
      
      // Add a 1-second pause before trying the loop again
      await this.page.waitForTimeout(1000); 
    }

    throw new Error("No email received in inbox");
  }
  async verifyEmailPrice(expectedPrice: string) {
    // Target the iframe where the body of the email lives
    const mailFrame = this.page.frameLocator('iframe[name="ifmail"]');
    
    // Assert that the h1 contains our dynamic price
    await expect(mailFrame.locator('h1')).toContainText(expectedPrice);
    
    console.log(`Successfully verified email contains price: ${expectedPrice}`);
  }

}