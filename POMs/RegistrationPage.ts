import {Page,expect} from "@playwright/test"

export const generateEmail = () => {
  return `sl_auto_${Math.floor(Math.random() * 10000)}@yopmail.com`;
};

export const generatePhoneNumber = () => {
  return `${Math.floor(100000000 + Math.random() * 900000000)}`;
};

export class Registration {
  readonly page: Page;

  private email!: string;
  private password: string = '$Martl0tt0';

  constructor(page: Page) {
    this.page = page;
  }

setEmail(email: string) {
    this.email = email;
  }

getEmail() {
    return this.email;
  }

getPassword() {
    return this.password;
  }

async Navigation() {
await this.page.goto('https://player.esmartlotto.ie/auth');
await this.page.getByRole('link', { name: 'Register Now' }).click();
}

async InvalidInputs() {
await this.page.getByRole('textbox', { name: 'Type here' }).first().click();
await this.page.getByRole('textbox', { name: 'Type here' }).first().fill('TestFirstName');
await this.page.getByRole('textbox', { name: 'Last Name*' }).click();
await this.page.getByRole('textbox', { name: 'Last Name*' }).fill('TestLastName');
await this.page.getByRole('textbox', { name: 'Type here' }).first().click();
await this.page.getByRole('textbox', { name: 'Email*' }).click();
await this.page.getByRole('textbox', { name: 'Email*' }).fill('automation@');
await this.page.getByRole('textbox', { name: 'Type here' }).nth(1).fill('0850000009');
}

async ValidInputs(){
const email = generateEmail();
const phone = generatePhoneNumber();
console.log (email)
console.log (phone)
await this.page.getByRole('textbox', { name: 'Email*' }).click();
await this.page.getByRole('textbox', { name: 'Email*' }).fill(email);
await this.page.locator('.ng-input').first().click();
await this.page.getByRole('option', { name: 'AL (+355)' }).click();
await this.page.getByRole('textbox', { name: 'Type here' }).nth(1).click();
await this.page.getByRole('textbox', { name: 'Type here' }).nth(1).fill(phone);
await this.page.locator('ng-select').filter({ hasText: 'Find Club' }).getByRole('combobox').click();
await this.page.getByText('Automation GAA').click();
await this.page.getByRole('button', { name: 'Continue' }).click();
return email;
}

async FindAddress(){
await this.page.getByRole('textbox', { name: 'Search by Eircode, Address' }).click();
await this.page.getByRole('textbox', { name: 'Search by Eircode, Address' }).fill('dublin');
await this.page.getByRole('link', { name: 'Dublin, 70 Monastery Gate' }).click();
await expect(this.page.getByRole('textbox', { name: 'Type here' }).first()).toHaveValue('Dublin', { timeout: 3000 });
await this.page.locator('.text-center').first().click();
await this.page.locator('.d-flex.align-items-cetner.mt-3 > .app-form--checkbox > .text-center').click();
await this.page.getByRole('button', { name: 'Submit' }).click();
}

async InvalidOTP(){
await this.page.getByRole('textbox').first().click();
await this.page.getByRole('textbox').first().fill('1');
await this.page.getByRole('textbox').nth(1).click();
await this.page.getByRole('textbox').nth(1).fill('2');
await this.page.getByRole('textbox').nth(2).click();
await this.page.getByRole('textbox').nth(2).fill('3');
await this.page.getByRole('textbox').nth(3).click();
await this.page.getByRole('textbox').nth(3).fill('4');
await this.page.getByRole('button', { name: 'Submit Code' }).click();
}

async enterOTP(otp: string) {
const digits = otp.split('');
await this.page.getByRole('textbox').nth(0).fill(digits[0]);
await this.page.getByRole('textbox').nth(1).fill(digits[1]);
await this.page.getByRole('textbox').nth(2).fill(digits[2]);
await this.page.getByRole('textbox').nth(3).fill(digits[3]);
await this.page.getByRole('button', { name: 'Submit Code' }).click();
}

async createPassword(){
const password = '$Martl0tt0'
await this.page.getByRole('textbox', { name: 'Type here' }).first().click();
await this.page.getByRole('textbox', { name: 'Type here' }).first().fill(password);
await this.page.getByRole('textbox', { name: 'Type here' }).nth(1).click();
await this.page.getByRole('textbox', { name: 'Type here' }).nth(1).fill(password);
await this.page.getByRole('button', { name: 'Save' }).click();
}

async login(){
await this.page.getByRole('link', { name: 'Login', exact: true }).click();
await this.page.locator('input[type="email"]').click();
await this.page.locator('input[type="email"]').fill(this.email);
await this.page.locator('input[type="password"]').click();
await this.page.locator('input[type="password"]').fill(this.password);
await this.page.getByRole('button', { name: 'Login' }).click();
}
}
