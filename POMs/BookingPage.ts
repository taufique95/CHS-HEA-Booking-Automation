import { Page, expect } from '@playwright/test';

// Define interfaces for your test data
export interface PropertyConfig {
  houseType: string; // 'Detached' | 'Semi-Detached' | 'Mid-Terrace' | 'End of Terrace' | 'Basement Apartment' | 'Ground-floor Apartment' | 'Mid-Floor Apartment' | 'Top-Floor Apartment' | 'Maisonette'
  storeys: string;
  hasExistingExtension: string;
  plansToExtend: string;
  
}

export interface UserConfig {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
}

export class HeaBookingPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;

    const popupModal = this.page.locator('.app-modal-body').filter({ hasText: 'Request a Free, No-Obligation' });

    // Register the handler using our unique locator
    this.page.addLocatorHandler(
      popupModal,
      async () => {
        console.log('Intercepted random modal. Closing it...');
        
        // Use the same unique locator to find the button INSIDE that specific modal
        await popupModal.getByRole('button').filter({ hasText: /^$/ }).click();
      }
    );
  }


  // --- Actions ---
  async navigateToAssessment() {
    await this.page.goto('http://52.49.147.125:3005/');
    await this.page.getByRole('navigation').getByText('Our Services').click();
    await this.page.getByRole('link', { name: 'Home Energy Assessment - Your' }).click();
    await this.page.getByRole('button', { name: 'Book your Home Energy' }).click();
  }


  async fillPropertyDetails(config: PropertyConfig) {
    await this.page.getByText(config.houseType, { exact: true }).click();
    await this.page.locator('label').filter({ hasText: config.storeys }).click();
    await this.page.getByText(config.hasExistingExtension).first().click();
    await this.page.getByText(config.plansToExtend).nth(1).click();
    await this.page.getByRole('button', { name: 'Next' }).click();
    await this.page.getByRole('button', { name: 'Next' }).click();
  }


  async fillContactDetails(user: UserConfig) {
    await this.page.locator('#tab-header input[name="firstName"]').fill(user.firstName);
    await this.page.locator('#tab-header input[name="lastName"]').fill(user.lastName);
    await this.page.locator('#tab-header input[name="email"]').fill(user.email);
    await this.page.locator('#tab-header input[name="phone"]').fill(user.phone);
  }


  async selectAddress() {
    await this.page.getByRole('textbox', { name: 'Search By Eircode, Address' }).fill('dublin');
    await this.page.getByText('Dublin, 70 Monastery Gate').click();
    await this.page.waitForTimeout(2000);
    await this.page.getByRole('button', { name: 'Next Act now and save big!' }).click();
    console.log('Waiting for calendar to render');
    await this.page.waitForTimeout(8000); //Wait for the custom calender to render
  }


  async scheduleAppointment() {
    let dateSelected = false;
    let monthsChecked = 0;
    const maxMonthsToCheck = 6; 

    while (!dateSelected && monthsChecked < maxMonthsToCheck) {
      await this.page.locator('div.day').first().waitFor({ state: 'visible' });
      await this.page.waitForTimeout(500); 

      // 1. BULLETPROOF LOCATOR: 
      // Excludes 'disabled', 'cursor-not-allowed', and 'full' classes.
      // Additionally filters out any cell containing the text "Full".
      const availableDates = this.page
        .locator('div.day:not(.cursor-not-allowed):not(.disabled):not(.full)')
        .filter({ hasNotText: 'Full' });
      
      const count = await availableDates.count();

      if (count > 0) {
        // Condition A: Dates are available. Click the first valid one.
        console.log(`Found ${count} valid available dates this month. Selecting the first one.`);
        await availableDates.first().click();
        dateSelected = true; 
      } else {
        // Condition B: No valid dates available. Move to the next month.
        console.log(`No valid dates in month ${monthsChecked + 1}. Clicking next month...`);
        
        // Click the "Next Month" button
        await this.page.getByRole('button').nth(2).click();
        
        monthsChecked++;
      }
    }

    if (!dateSelected) {
      throw new Error('Test Failed: Could not find any available appointments in the next 6 months.');
    }

    // 2. Continue with conditional time slot selection
    // Give the UI a brief moment to render the time slots after the date is clicked
    await this.page.waitForTimeout(500); 

    const morningSlot = this.page.locator('div').filter({ hasText: /^Morning8:00 AM - 11:00 AM$/ }).nth(1);
    const afternoonSlot = this.page.locator('div').filter({ hasText: /^Afternoon2:00 PM - 5:00 PM$/ }).first();

    // Prioritize Morning: If it exists, click it. If not, fallback to Afternoon.
    if (await morningSlot.isVisible()) {
      console.log('Morning slot is available. Selecting Morning.');
      await morningSlot.click();
    } else if (await afternoonSlot.isVisible()) {
      console.log('Morning not available. Selecting Afternoon.');
      await afternoonSlot.click();
    } else {
      // Failsafe in case a date is clickable but the slots fail to load
      throw new Error('Test Failed: Neither morning nor afternoon slots were available for the selected date.');
    }

    // Proceed to next step
    await this.page.getByRole('button', { name: 'Next' }).click();
  }


  async verifyCompletionAndSkipGrants() {
    await this.page.getByRole('button', { name: 'Later' }).click();
  }

  
  async extractBookingPrice(): Promise<string> {
    // 1. Grab the full text from the header
    const headerText = await this.page.locator('#tab-header').innerText();

    // 2. Use a Regular Expression to find the Euro symbol followed by numbers
    // This regex will safely match €526, €1,200, or €526.00
    const priceMatch = headerText.match(/€[0-9,.]+/); 

    if (!priceMatch) {
      throw new Error(`Test Failed: Could not find a Euro price in the header text: "${headerText}"`);
    }

    const dynamicPrice = priceMatch[0];
    console.log(`Extracted dynamic price: ${dynamicPrice}`);
    
    // 3. Return the price so the test script can hold onto it
    return dynamicPrice; 
  }
}