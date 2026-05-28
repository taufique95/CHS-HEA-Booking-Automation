# Churchfield Home Services - HEA Booking Automation

A robust, enterprise-grade test automation framework built with **Playwright** and **TypeScript** utilizing the **Page Object Model (POM)** pattern. This suite automates the complete end-to-end flow of the Home Energy Assessment (HEA) form submission, handles dynamic UI components, and performs cross-tab verification via Yopmail.

## Key Features

- • **Page Object Model (POM) Architecture**: Clean separation of test specifications from page-specific element locators and actions, minimizing boilerplate and ensuring high maintainability.
- • **Data-Driven Configuration Block**: Fully parameterized test scenarios where variables like house types (9 custom classifications), storeys, and contact information are injected via a single configuration block.
- • **Global Modal Interception**: Utilizes Playwright's native `page.addLocatorHandler()` to asynchronously capture and close intermittent popup modals (`.app-modal-body`) on any page without polluting test steps with `try/catch` blocks.
- • **Smart Calendar Date Selection**: Dynamically scans calendar elements to find the first valid date. It explicitly filters out custom visually disabled styles and full slots (`div.day:not(.disabled):not(.full)`), automatically navigating to subsequent months if the current month is fully booked.
- • **Conditional Time-Slot Allocation**: Evaluates real-time slot availability post-date selection, executing priority routing to click the Morning slot if available, with a safe fallback to Afternoon.
- • **Cross-Tab & Iframe-Safe Verification**: Spawns distinct browser contexts to handle multi-tab flows. It safely traverses Yopmail's nested frame structure (`#ifinbox` and `iframe[name="ifmail"]`), uses regular expressions to extract dynamic currency values from the application header, and verifies parity within the received confirmation email.

---

## Project Structure

```text
├── POMs/
│   ├── BookingPage.ts     # Locators and structural logic for the HEA booking wizard
│   └── Yopmail.ts         # Iframe handlers and async polling loops for email verification
├── tests/
│   └── HEA.spec.ts        # Main test runner containing data configurations and test execution
├── .gitignore             # Target exclusion list for node_modules and local test reports
├── playwright.config.ts   # Global Playwright configuration profile
└── package.json           # Project dependencies and script shortcuts
```
## Prerequisites

Ensure you have the following installed locally:
- • [Node.js](https://nodejs.org/) (v18 or higher recommended)
- • [Git](https://git-scm.com/)

---

## Setup & Installation

1. **Clone the repository:**
```bash
   git clone [https://github.com/taufique95/CHS-HEA-Booking-Automation.git](https://github.com/taufique95/CHS-HEA-Booking-Automation.git)
   cd CHS-HEA-Booking-Automation
   ```

2. **Install project dependencies:**
```bash
   npm install
   ```

3. **Install required browser binaries:**
```bash
   npx playwright install
   ```

---

## Running the Tests

Execute the full suite in headless mode (default):
```bash
npx playwright test
```

Execute tests with the UI visual runner enabled:
```bash
npx playwright test --ui
```

Debug step-by-step using the Playwright Inspector:
```bash
npx playwright test --debug
```

---

## Test Configuration Example

The test suite is built to adapt instantly to application scenarios by adjusting the `bookingConfig` object located inside `tests/HEA.spec.ts`:

```typescript
const bookingConfig = {
  property: {
    houseType: 'Top-Floor Apartment', // Supports Detached, Semi-Detached, Mid-Terrace, Maisonette, etc.
    storeys: '2 Storeys',
    hasExistingExtension: 'No',
    plansToExtend: 'Yes',
    imagePath: 'Screenshot_3.png'
  },
  user: {
    firstName: 'TestFirstName',
    lastName: 'TestLastName',
    email: 'yourprofile@yopmail.com',
    phone: '123456789',
    searchAddress: 'dublin'
  }
};
```


### How to add this to your repository from the terminal:
If you want to create and push this file quickly without leaving your terminal, run these commands inside your project folder:

```bash
# 1. Open/create the file and paste the markdown inside, then save it.
# Or quickly use your code editor (e.g., VS Code):
code README.md

# 2. Stage the new readme file
git add README.md

# 3. Commit the changes
git commit -m "docs: add comprehensive README documentation"

# 4. Push to your GitHub main branch
git push origin main
