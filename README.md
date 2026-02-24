# DemoBlaze E2E Automation Framework

A modern end-to-end test automation framework built with **Playwright** and **TypeScript** for the [DemoBlaze](https://www.demoblaze.com/) e-commerce application.

## 🚀 Framework Features

- **Playwright Test Runner**: Fast and reliable test execution
- **Cross-Browser Testing**: Chromium, Firefox, WebKit + Mobile support
- **Page Object Model (POM)**: Modular and maintainable architecture
- **TypeScript**: Type-safe test development
- **CI/CD Ready**: GitHub Actions workflow included
- **Comprehensive Reporting**: HTML, JSON, JUnit reports with screenshots
- **Parallel Execution**: Full parallel test execution
- **API Testing**: REST API tests using Playwright's `APIRequestContext`
- **Environment Configuration**: Configurable via `.env` file

## 📁 Project Structure

```text
├── src/
│   ├── api/                # API client and endpoints
│   ├── config/             # Environment configuration
│   ├── fixtures/           # Playwright test fixtures (Page Object injection)
│   ├── pages/              # Page Object Model classes
│   │   └── components/     # Reusable UI components (Header, Modal)
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Helper utilities (logger, validators, etc.)
├── tests/
│   ├── api/                # API tests
│   └── ui/                 # UI tests (login, cart, e2e)
├── test-data/              # Test data (JSON)
├── reports/                # Test reports (generated, gitignored)
├── .github/workflows/      # CI/CD pipeline (GitHub Actions)
└── docs/                   # Documentation
```

## 🛠️ Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

## 📦 Installation

```bash
# Install dependencies (also installs Playwright browsers via postinstall)
npm install

# Or install Playwright browsers separately
npm run prepare
```

## ⚙️ Configuration

```bash
# Copy environment template and edit with your configuration
cp .env.example .env
```

Key environment variables:

| Variable | Default | Description |
| --- | --- | --- |
| `BASE_URL` | `https://www.demoblaze.com` | Application base URL |
| `API_URL` | `https://api.demoblaze.com` | API base URL |
| `TEST_USERNAME` | `testuser123` | Test user username |
| `TEST_PASSWORD` | `testpass123` | Test user password |
| `TIMEOUT` | `30000` | Default timeout (ms) |
| `HEADLESS` | `true` | Run in headless mode |

## 🧪 Running Tests

### All Tests

```bash
npm test
```

### UI Tests

```bash
npm run test:ui
```

### API Tests

```bash
npm run test:api
```

### Specific Test Suites

```bash
npm run test:login   # Login tests
npm run test:cart    # Cart tests
npm run test:e2e     # E2E flow tests
```

### Cross-Browser Testing

```bash
npm run test:chromium   # Chromium only
npm run test:firefox    # Firefox only
npm run test:webkit     # WebKit (Safari) only
```

### Debug & Visual Mode

```bash
# Run with browser visible (headed mode)
npm run test:headed

# Step-by-step with Playwright Inspector
npm run test:debug

# Run headed, one at a time, Chromium only (recommended for demo)
npx playwright test --headed --project=chromium --workers=1

# Open interactive UI mode
npx playwright test --ui
```

### Run a Specific Test by Name

```bash
npx playwright test -g "should login successfully" --headed --project=chromium
```

## 📊 Test Reports

After running tests, view the HTML report:

```bash
npm run report
```

Reports are generated in `reports/html-report/`.

Clean up reports:

```bash
npm run clean
```

## 🔧 Key Commands

| Command | Description |
| --- | --- |
| `npm test` | Run all tests (all browsers) |
| `npm run test:ui` | Run UI tests only |
| `npm run test:api` | Run API tests only |
| `npm run test:login` | Run login tests |
| `npm run test:cart` | Run cart tests |
| `npm run test:e2e` | Run E2E flow tests |
| `npm run test:chromium` | Run on Chromium only |
| `npm run test:firefox` | Run on Firefox only |
| `npm run test:webkit` | Run on WebKit only |
| `npm run test:headed` | Run with browser visible |
| `npm run test:debug` | Run with Playwright Inspector |
| `npm run report` | Open HTML report |
| `npm run clean` | Clean report files |
| `npm run typecheck` | TypeScript type checking |

## 🧩 Test Coverage

### Login Module (@login)

- ✅ Successful login with valid credentials
- ✅ Logout after login
- ✅ Welcome message verification
- ✅ Close login modal
- ✅ Invalid credentials handling
- ✅ Non-existent user handling
- ✅ Empty username/password validation
- ✅ SQL injection prevention
- ✅ XSS prevention
- ✅ Signup new user
- ✅ Signup existing user error
- ✅ Login/Signup modal UI elements

### Cart Module (@cart)

- ✅ Add single product to cart
- ✅ Add multiple products to cart
- ✅ Add products from different categories
- ✅ Delete item from cart
- ✅ Delete specific item by name
- ✅ Clear entire cart
- ✅ Cart total calculation (single & multiple items)
- ✅ Total update after deletion
- ✅ Category navigation (phones, laptops, monitors)
- ✅ Product detail verification

### E2E Flows (@e2e)

- ✅ Complete purchase as logged-in user
- ✅ Complete purchase with multiple items
- ✅ Guest checkout (without login)
- ✅ Purchase from different categories
- ✅ Remove item before purchase
- ✅ Cart persistence after login
- ✅ Cart persistence after logout/re-login
- ✅ Minimal order form data
- ✅ Product detail verification before adding to cart

### API Tests (@api)

- ✅ Get all product entries
- ✅ Get product by ID
- ✅ Get products by category (phone, laptop, monitor)
- ✅ Signup new user
- ✅ Signup existing user (error)
- ✅ Login with valid credentials
- ✅ Login with invalid credentials
- ✅ Add item to cart
- ✅ View cart

## 🔄 CI/CD

GitHub Actions workflow (`.github/workflows/playwright.yml`) runs:

- On push/PR to `main`/`develop`
- Daily scheduled runs (6:00 AM UTC)
- Cross-browser matrix testing (Chromium, Firefox, WebKit)
- Separate jobs for smoke tests and API tests
- Automatic report upload as artifacts

## 🏗️ Architecture

### Page Object Model (POM)

```text
BasePage (abstract)
├── HomePage      → Product grid, categories, navigation
├── LoginPage     → Login/Signup modals
├── ProductPage   → Product details, Add to cart
└── CartPage      → Cart items, Place order, Purchase confirmation

Components:
├── HeaderComponent → Navigation, Login/Logout/Cart links
└── ModalComponent  → Reusable modal dialog handler
```

### Test Fixtures

Custom Playwright fixtures automatically inject Page Objects into tests:

```typescript
import { test, expect } from '../../src/fixtures';

test('example', async ({ homePage, loginPage, cartPage, productPage }) => {
  // Page objects are ready to use
  await homePage.open();
});
```

## 📝 Writing New Tests

1. Create a Page Object in `src/pages/` if needed (extend `BasePage`)

2. Add the page to fixtures in `src/fixtures/pages.fixture.ts`

3. Write test in `tests/ui/` or `tests/api/`:

```typescript
import { test, expect } from '../../src/fixtures';

test.describe('My New Feature', () => {
  test('should do something', async ({ homePage, loginPage }) => {
    await homePage.open();
    // ... test steps
  });
});
```

4. Add test data in `test-data/` as JSON files

## 📄 License

MIT License
