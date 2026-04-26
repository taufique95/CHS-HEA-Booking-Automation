import { test,expect } from '@playwright/test';
import { HeaBookingPage } from '../POMs/BookingPage';
import { Yopmail } from "../POMs/YopmailPage"
test.use({ viewport: { width: 1280, height: 720 } });

test('User can successfully book a Home Energy Assessment', async ({ page,context }) => {
  const heaBookingPage = new HeaBookingPage(page);

  // 1. The Configuration Block==================================================
  const bookingConfig = {
    property: {
      // Copy the properties from the comments to change options
      houseType: 'Semi-Detached', // 'Detached' | 'Semi-Detached' | 'Mid-Terrace' | 'End of Terrace' | 'Basement Apartment' | 'Ground-floor Apartment' | 'Mid-Floor Apartment' | 'Top-Floor Apartment' | 'Maisonette'
      storeys: '2 Storeys',    // '1 Storey' | '2 Storeys' | '3 Storeys'
      hasExistingExtension: 'No',    // 'Yes' | 'No'
      plansToExtend: 'Yes',       // 'Yes' | 'No'    
      
    },
    user: {
      firstName: 'TestFirstName',
      lastName: 'TestLastName',
      email: 'auto_hea@yopmail.com',
      phone: '123456789',
      
    }
  };

  // 2. Execute test flow using the config
  await heaBookingPage.navigateToAssessment();
  await expect(page.locator('h1')).toContainText('Home Energy Assessment');
  
  await heaBookingPage.fillPropertyDetails(bookingConfig.property);
  await expect(page.getByRole('heading', { name: bookingConfig.property.houseType })).toBeVisible()
  
  await heaBookingPage.fillContactDetails(bookingConfig.user);
  await heaBookingPage.selectAddress();
  
const expectedBookingPrice = await heaBookingPage.extractBookingPrice();

  await heaBookingPage.scheduleAppointment();
  await heaBookingPage.verifyCompletionAndSkipGrants();
  await expect(page.getByText(bookingConfig.user.email)).toBeVisible();

// Open Yopmail in new tab
const yopmailTab = await context.newPage(); 
const yopmail = new Yopmail(yopmailTab);

  await yopmail.navigate();
  await yopmail.enterEmail(bookingConfig.user.email);
  await yopmail.openLatestEmail();
  await yopmail.verifyEmailPrice(expectedBookingPrice); //Asserts booking price matches with the email in inbox
});

