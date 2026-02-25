# DemoBlaze E2E Automation Framework

A comprehensive BDD test automation framework built with **Playwright**, **TypeScript**, and **Cucumber/Gherkin** for the [DemoBlaze](https://www.demoblaze.com/) e-commerce application.

## Test Coverage Summary
- Link test suite google sheet : https://docs.google.com/spreadsheets/d/1D6ttaFbaNPsbJc_UsrgNcPz1uBj7xwcxTOOFLxwxqNk/edit?usp=sharing

## Framework Features

- BDD with Gherkin: Human-readable test scenarios in `.feature` files
- Playwright + TypeScript: Fast, reliable, type-safe test execution
- Page Object Model (POM): Modular and maintainable architecture
- Cross-Browser Testing: Chromium, Firefox, WebKit support
- Comprehensive Coverage: 144 test cases covering Happy Path & Edge Cases
- API Testing: REST API tests included
- CI/CD Ready: GitHub Actions workflow included

---

## Project Structure

```
├── features/               # BDD Feature files (Gherkin)
│   ├── login.feature       # Login & Signup scenarios (58 tests)
│   ├── cart.feature        # Shopping cart scenarios (51 tests)
│   └── e2e-purchase.feature # End-to-end purchase flows (9 tests)
├── steps/                  # Step definitions
│   ├── login.steps.ts
│   ├── cart.steps.ts
│   ├── product.steps.ts
│   ├── order.steps.ts
│   ├── common.steps.ts
│   └── fixtures.ts         # BDD fixtures
├── src/
│   ├── pages/              # Page Object Model classes
│   ├── api/                # API client
│   ├── config/             # Environment configuration
│   ├── types/              # TypeScript types
│   └── utils/              # Utilities (logger, helpers)
├── tests/api/              # API tests (26 tests)
├── test-data/              # Test data (JSON)
├── reports/                # Test reports (generated)
├── README.md               # Full documentation
└── test-suite.txt          # Detailed test suite document
```

---

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

---

## Installation

```bash
# Clone repository
git clone https://github.com/HienPham2022/QA_Automation_Challenge_HienPhamVan.git
cd QA_Automation_Challenge_HienPhamVan

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

---

## Running Tests

> 📖 **See [QUICK_START.md](QUICK_START.md) for detailed Vietnamese guide**

### Quick Start

```bash
# Run ALL tests (headless - fast)
npm test

# Run with browser visible (demo/debug)
npm run test:headed
```

### Run by Feature Tag (Headless)

```bash
# Login feature tests (58 tests)
npm run test:login

# Cart feature tests (51 tests)
npm run test:cart

# E2E purchase flow tests (9 tests)
npm run test:e2e

# Smoke tests only (6 tests)
npm run test:smoke
```

### Run by Test Type (Headless)

```bash
# Happy Path tests only (63 tests)
npm run test:happy-path

# Edge Case tests only (81 tests)
npm run test:edge-case

# Security tests only (7 tests)
npm run test:security

# API tests only (26 tests)
npm run test:api
```

### Run on Specific Browser

```bash
npm run test:chromium   # Chrome
npm run test:firefox    # Firefox
npm run test:webkit     # Safari
```

---

## Run Tests with Browser Visible (Headed Mode)

### Run by Feature (with Browser)

```bash
# Run ALL Login tests with browser visible
npm run test:login:headed

# Run ALL Cart tests with browser visible
npm run test:cart:headed

# Run ALL E2E tests with browser visible
npm run test:e2e:headed

# Run ALL Smoke tests with browser visible
npm run test:smoke:headed
```

### Run by Test Suite Type (with Browser)

```bash
# Run ALL Happy Path tests with browser visible
npm run test:happy-path:headed

# Run ALL Edge Case tests with browser visible
npm run test:edge-case:headed

# Run ALL Security tests with browser visible
npm run test:security:headed
```

### Run ALL Tests with Browser

```bash
# Run everything with browser visible
npm run test:headed
```

---

## Run Specific Scenario (with Browser)

To run a single test scenario with the browser visible:

```bash
# Step 1: Generate tests from feature files (required once)
npm run bddgen

# Step 2: Run specific scenario by name
npx playwright test -g "Scenario Name" --headed --project=chromium --workers=1
```

### Examples

```bash
# Run specific login test
npm run bddgen
npx playwright test -g "Successful login with valid credentials" --headed --project=chromium --workers=1

# Run specific cart test
npm run bddgen
npx playwright test -g "Add a single product to the cart" --headed --project=chromium --workers=1

# Run specific E2E test
npm run bddgen
npx playwright test -g "Complete purchase as a logged-in user" --headed --project=chromium --workers=1
```

### One-liner command

```bash
npm run bddgen ; npx playwright test -g "Add a single product to the cart" --headed --project=chromium --workers=1
```

---

## Debug Mode

```bash
# Debug with Playwright Inspector (step-by-step)
npm run test:debug

# Interactive UI Mode (best for debugging)
npx playwright test --ui
```

---

## View Test Reports

```bash
# Open HTML report after test run
npm run report

# Reports are saved in: reports/html-report/
```

---

## Clean Up

```bash
# Remove generated reports and test artifacts
npm run clean
```

---

## All Available Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all BDD tests (headless) |
| `npm run test:headed` | Run ALL tests with browser visible |
| **Feature Tests** | |
| `npm run test:login` | Run Login feature tests |
| `npm run test:login:headed` | Run Login tests with browser |
| `npm run test:cart` | Run Cart feature tests |
| `npm run test:cart:headed` | Run Cart tests with browser |
| `npm run test:e2e` | Run E2E purchase tests |
| `npm run test:e2e:headed` | Run E2E tests with browser |
| **Test Suite Types** | |
| `npm run test:smoke` | Run smoke tests only |
| `npm run test:smoke:headed` | Run smoke tests with browser |
| `npm run test:happy-path` | Run happy path tests |
| `npm run test:happy-path:headed` | Run happy path with browser |
| `npm run test:edge-case` | Run edge case tests |
| `npm run test:edge-case:headed` | Run edge case with browser |
| `npm run test:security` | Run security tests |
| `npm run test:security:headed` | Run security tests with browser |
| **API & Utilities** | |
| `npm run test:api` | Run API tests |
| `npm run test:debug` | Run with Playwright Inspector |
| `npm run test:chromium` | Run on Chrome only |
| `npm run test:firefox` | Run on Firefox only |
| `npm run test:webkit` | Run on Safari only |
| `npm run bddgen` | Generate tests from .feature files |
| `npm run report` | Open HTML test report |
| `npm run clean` | Clean generated reports |

---

### Login Feature Coverage (@login)

- Successful login/logout flow
- Session persistence after refresh
- Signup new user & login with new account
- Empty fields validation
- Invalid credentials handling
- SQL injection & XSS prevention
- Boundary testing (long inputs)
- Special characters handling
- Input manipulation (whitespace, tabs, newlines)
- UI interaction (Enter key, double-click, rapid clicks)
- Browser navigation persistence
- Local storage clearing behavior

### Cart Feature Coverage (@cart)

- Add single/multiple products
- Add from all categories (Phones, Laptops, Monitors)
- Delete items (by index, by name, clear all)
- Cart total calculations
- Cart persistence (navigation, refresh, login)
- Empty cart handling
- Product detail verification

### E2E Purchase Coverage (@e2e)

- Complete purchase as logged-in user
- Complete purchase as guest
- Multi-item purchase
- Cart modification before checkout

### API Testing Coverage (@api)

**Product API (6 tests)**
- Get all products, get by ID, filter by category
- Invalid category handling

**Authentication API (5 tests)**
- Signup new user, duplicate signup prevention
- Login with valid/invalid credentials
- Session management (logout)

**Cart API (15 tests)**
- Happy Path: Add/view/delete items, login cart, cart sequence
- Edge Cases: Duplicate products, invalid IDs, session isolation, concurrent operations

---

## Architecture

### Page Object Model

```
BasePage (abstract)
├── HomePage      - Product grid, categories
├── LoginPage     - Login/Signup modals
├── ProductPage   - Product details, Add to cart
└── CartPage      - Cart items, Checkout flow

Components:
├── HeaderComponent - Navigation links
└── ModalComponent  - Modal dialog handler
```

### BDD Layer

```
features/*.feature     - Gherkin scenarios
       |
steps/*.steps.ts       - Step definitions
       |
src/pages/*.ts         - Page Objects
       |
Playwright API         - Browser automation
```

---

## Environment Configuration

Copy `.env.example` to `.env` and configure:

| Variable | Default | Description |
|----------|---------|-------------|
| `BASE_URL` | `https://www.demoblaze.com` | Application URL |
| `API_URL` | `https://api.demoblaze.com` | API URL |
| `HEADLESS` | `true` | Run headless mode |
| `TIMEOUT` | `30000` | Default timeout (ms) |

---

## CI/CD

GitHub Actions workflow runs automatically on:
- Push/PR to `main` branch
- Cross-browser testing (Chromium, Firefox, WebKit)
- Test reports uploaded as artifacts

---

## Writing New Tests

### 1. Add scenario to feature file

```gherkin
# features/login.feature
@login @happy-path
Scenario: My new login test
  Given I am on the DemoBlaze homepage
  When I open the login modal
  And I login with username "user" and password "pass"
  Then I should be logged in as "user"
```

### 2. Create step definition (if needed)

```typescript
// steps/login.steps.ts
When('I do something new', async ({ loginPage }) => {
  await loginPage.doSomething();
});
```

### 3. Generate and run

```bash
npm run bddgen
npm run test:login
```

---

## License

MIT License

---

## Author

Hien Pham Van

GitHub: https://github.com/HienPham2022
