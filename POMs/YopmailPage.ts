import { Page } from "@playwright/test";

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
    await this.page.getByRole('button', { name: '' }).click();
    await this.page.waitForTimeout(5000)
  }

  async openLatestEmail() {
    const inboxFrame = this.page.frameLocator('#ifinbox');

    for (let i = 0; i < 5; i++) {
      const emails = await inboxFrame.locator('div.m').count();

      if (emails > 0) {
        await inboxFrame.locator('div.m').first().click();
        return;
      }
    }

    throw new Error("No email received in inbox");
  }

  async getOTP(): Promise<string> {
    const mailFrame = this.page.frameLocator('#ifmail');

  // 🔹 Wait for email content to load properly
  const otpElement = mailFrame.locator('h3 b');
  await otpElement.waitFor({ state: 'visible' });

  const otp = (await otpElement.innerText()).trim();

  if (!otp || otp.length !== 4) {
    throw new Error(`Invalid OTP fetched: ${otp}`);
  }

  return otp;
  }
}