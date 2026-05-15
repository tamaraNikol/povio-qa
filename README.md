# Povio QA — Playwright End-to-End Tests

A comprehensive automated end-to-end test suite for the [Povio Automation Testing Application](https://povio-at.herokuapp.com/), built with [Playwright](https://playwright.dev/) and TypeScript.

This project demonstrates professional test automation practices including:
- ✅ Page Object Model architecture
- ✅ Custom test fixtures and helpers
- ✅ Custom assertions for enhanced readability
- ✅ Centralized selectors and constants
- ✅ Tag-based test organization
- ✅ Comprehensive HTML and JSON reporting
- ✅ CI/CD integration with GitHub Actions
- ✅ ESLint code quality checks

---

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| Node.js | ≥ 18 | https://nodejs.org |
| npm | ≥ 9 | Bundled with Node.js |
| Git | any | https://git-scm.com |

> **IntelliJ users:** Make sure the Node.js plugin is enabled under *Settings → Plugins*.

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/tamaraNikol/povio-qa.git
cd povio-qa
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright browsers

```bash
npx playwright install chromium
```

That's it. No `.env` file or credentials are required — the tests generate unique users on each run and clean up after themselves.

---

## Running Tests

### Run all tests (headless)

```bash
npm test
```

### Run all tests with browser visible

```bash
npm run test:headed
```

### Run a single test file

```bash
npx playwright test tests/health-check.spec.ts
```

### Run tests by tag

```bash
# Run smoke tests only
npx playwright test --grep "@smoke"

# Run critical tests
npx playwright test --grep "@critical"

# Exclude slow tests
npx playwright test --grep-invert "@slow"
```

### Run tests in debug mode (step through)

```bash
npm run test:debug
```

### View the HTML report after a run

```bash
npm run test:report
```

---

## Linting

```bash
npm run lint          # Check for issues
npm run lint:fix      # Auto-fix where possible
```

---

## Project Structure

```
povio-qa/
├── tests/                          # Test specifications
│   ├── health-check.spec.ts        # App health and availability checks
│   ├── authentication.spec.ts      # Login flow tests
│   ├── registration.spec.ts        # User registration happy path
│   ├── registration-validation.spec.ts  # Registration form validation
│   ├── campaigns.spec.ts           # Campaign CRUD operations
│   ├── campaigns-validation.spec.ts   # Campaign form validation
│   └── custom-matchers.example.spec.ts  # Custom matcher usage examples
├── utils/                          # Utilities and helpers
│   ├── api-helpers.ts              # User generation & API cleanup
│   ├── constants.ts                # Centralized constants and config
│   ├── selectors.ts                # Centralized CSS selectors
│   ├── matchers/                   # Custom Playwright matchers
│   │   ├── custom-matchers.ts
│   │   ├── custom-matchers.d.ts
│   │   └── README.md
│   └── pages/                      # Page Object Models
│       ├── base.page.ts            # Shared base class
│       ├── register.page.ts        # Registration page
│       ├── login.page.ts           # Login page
│       └── campaigns.page.ts       # Campaigns page
├── fixtures/                       # Test fixtures
│   ├── test-fixtures.ts            # Custom Playwright fixtures
│   └── test-helpers.ts             # Test helper functions
├── reports/                        # Generated reports (gitignored)
│   ├── html/                       # HTML report
│   ├── results.json                # JSON results
│   └── test-results/               # Screenshots, videos, traces
├── .github/workflows/
│   └── playwright.yml              # GitHub Actions CI pipeline
├── playwright.config.ts            # Playwright configuration
├── playwright-custom-matchers.d.ts # TypeScript definitions
├── tsconfig.json                   # TypeScript configuration
├── .eslintrc.json                  # ESLint configuration
├── TEST_PLAN.md                    # Test plan for upcoming features
└── README.md                       # This file
```

---

## Test Coverage

| Suite | Tests | Description |
|---|---|---|
| **Health Check** | 1 test | Verifies app responds with 200, navigation and key elements render |
| **Authentication** | 11 tests | Login, logout, session management, access control, boundary tests |
| **Registration** | 2 tests | Valid user registration, duplicate email rejection |
| **Registration Validation** | 6 tests | Form validation (empty fields, invalid email, password requirements, browser validation) |
| **Campaigns** | 2 tests | Create campaign, edit campaign |
| **Campaigns Validation** | 7 tests | Form validation, edge cases, special characters, data preservation |
| **Custom Matchers** | 3 tests | Demonstrates custom assertion usage examples |

**Total: 32 tests** across 7 test suites

### Test Organization

Tests are organized with tags for easy filtering:
- `@smoke` — Critical smoke tests that should run on every build
- `@critical` — High-priority test scenarios
- `@validation` — Form validation tests
- `@auth` — Authentication and authorization tests

### Data Management

- Each test generates a fresh unique user using UUID
- Automatic cleanup: test user accounts are deleted via API after each test
- Tests run sequentially (`workers: 1`) to avoid data conflicts

---

## CI / GitHub Actions

Tests run automatically on every push and pull request to `main`/`master`.

The pipeline:
1. Installs Node.js and dependencies
2. Installs Playwright Chromium
3. Runs ESLint
4. Runs all tests
5. Uploads the HTML report as a build artifact (kept 14 days)
6. Uploads screenshots on failure (kept 7 days)

---

## Reporting

After each run, comprehensive reports are generated in the `reports/` directory:

- **`reports/html/`** — Full interactive HTML report with screenshots and traces  
  Open with: `npm run test:report`
- **`reports/results.json`** — Machine-readable JSON results for CI integration
- **`reports/test-results/`** — Screenshots, videos, and traces from failed tests

### 📸 Automatic Screenshot Capture

✅ **Screenshots are automatically captured when tests fail** (`screenshot: 'only-on-failure'`)
- Saved to: `reports/test-results/`
- Naming format: `test-name-chromium/test-failed-1.png`
- Included in HTML reports for easy debugging
- Uploaded as CI artifacts (retained 7 days in GitHub Actions)

Additional capture options:
- **Videos**: Captured on first retry (`video: 'on-first-retry'`)
- **Traces**: Full execution traces on first retry (`trace: 'on-first-retry'`)

All failure artifacts are automatically linked in the HTML report for easy access.

---

## Key Features

### 🎯 Custom Matchers

The project includes custom Playwright matchers for more expressive assertions:

```typescript
// Check if an element is visible and has specific text
await expect(element).toBeVisibleWithText('Expected Text');

// Verify a form field has a validation error
await expect(input).toHaveValidationError('Email is required');

// Check campaign list contains a specific campaign
await expect(page).toContainCampaign('My Campaign');
```

See `utils/matchers/README.md` for complete documentation.

### 📦 Centralized Configuration

- **Selectors** (`utils/selectors.ts`) — All CSS selectors in one place for easy maintenance
- **Constants** (`utils/constants.ts`) — API endpoints, error messages, and config values
- **Page Objects** (`utils/pages/`) — Reusable page interaction logic

### 🏗️ Test Fixtures

Custom fixtures (`fixtures/test-fixtures.ts`) provide pre-configured:
- Page objects automatically instantiated for each test
- Test helpers for common operations
- Custom matchers automatically registered

### 🏷️ Tag-Based Organization

Tests are tagged for flexible execution:
```bash
npx playwright test --grep "@smoke"       # Quick health checks
npx playwright test --grep "@critical"    # Must-pass scenarios
npx playwright test --grep "@validation"  # All validation tests
```

---

## Test Plan

See [`TEST_PLAN.md`](./TEST_PLAN.md) for the comprehensive test plan covering upcoming features:
- **Roles and Permissions** — Administrator role with campaign deletion capabilities
- **User List** — Admin-only user management interface
- **Campaign Images** — Optional image upload with thumbnail display

The test plan includes:
- 28 detailed test cases across all features
- Priority matrix (Critical, High, Medium, Low)
- Risk analysis and mitigation strategies
- Entry and exit criteria

---

## Technology Stack

- **Test Framework:** Playwright v1.44.0
- **Language:** TypeScript v5.4.0
- **Code Quality:** ESLint with TypeScript support
- **CI/CD:** GitHub Actions
- **Node Version:** v18+

---

## Contributing

### Code Quality

Before committing changes:

```bash
# Run linter
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Run all tests
npm test
```

### Commit Guidelines

Use clear, descriptive commit messages:
- `feat: add custom matcher for campaign validation`
- `fix: resolve flaky login test`
- `docs: update README with new features`
- `refactor: extract selectors to centralized file`

---

## CI/CD Pipeline

Tests run automatically on every push and pull request via GitHub Actions.

**Pipeline steps:**
1. Set up Node.js environment
2. Install dependencies
3. Install Playwright browsers
4. Run ESLint checks
5. Execute all tests
6. Upload HTML report as artifact (retained 14 days)
7. Upload failure screenshots (retained 7 days)

---

## License & Copyright

This project is protected by Povio Inc.'s copyright. It may be hosted on private GitHub repositories for portfolio purposes, but any other reproduction or distribution requires written permission from Povio Inc.

---

## Contact & Support

For questions or issues with this test suite, please open a GitHub issue in this repository.
