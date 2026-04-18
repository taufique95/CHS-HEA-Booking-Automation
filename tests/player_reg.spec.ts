import { test, expect } from '@playwright/test'
import { Registration } from "../POMs/RegistrationPage"
import { Yopmail } from "../POMs/YopmailPage"


test('test', async ({ page,context }) => {

const reg = new Registration(page)

//Navigate to Smart Lotto Player Registration Portal
    await reg.Navigation();
    await expect(page).toHaveTitle('SmartLotto')
    await expect(page.getByRole('heading', { name: 'Register to play' })).toBeVisible()

//Assert error messages for email and phone fields with invalid inputs
    await reg.InvalidInputs()
    await expect(page.getByText('Enter your mobile number without the preceding zero')).toBeVisible()
    await expect(page.getByText('Invalid Email.')).toBeVisible();

//Registering & Asserting with valid information
    const generatedEmail = await reg.ValidInputs();
    await reg.FindAddress()
    await expect(page.locator('h3')).toContainText('Thank You for choosing Smart Lotto');

//Assert OTP field with invalid OTP
    await reg.InvalidOTP()
    await expect(page.getByRole('alert', { name: 'Invalid verification code.' })).toBeVisible();

//Get Valid OTP from YOPMAIL
    const yopPage = await context.newPage();
    const yop = new Yopmail(yopPage);

    await yop.navigate();
    await yop.enterEmail(generatedEmail);
    await yop.openLatestEmail();

    const otp = await yop.getOTP();

// Back to Smart Lotto registration page
    await page.bringToFront();

// Enter OTP fetched from Yopmail
    await reg.enterOTP(otp);

//Asserting OTP is valid and redirected to password creation page
    await expect(page.getByRole('heading', { name: 'Set New Password' })).toBeVisible();

//Create new password and login
    await reg.createPassword();
    reg.setEmail(generatedEmail);
    await reg.login();

//Assert successful login
    await expect(page.getByText('Hello')).toBeVisible();
  
})

  

  
  
  
  