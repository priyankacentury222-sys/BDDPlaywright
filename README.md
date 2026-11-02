# SauceDemo Playwright BDD Framework

This project runs Cucumber scenarios against SauceDemo using Playwright for browser automation and TypeScript for implementation.

## A. Project architecture

```text
features/                Gherkin feature files describing user behavior
step-definitions/        Cucumber steps that call page-object methods
pages/                   Page Object Model selectors and interactions
hooks/                   Per-scenario browser setup, teardown, and screenshots
config/                  Environment-specific values and runtime configuration
cucumber.js              Default Cucumber CLI paths, TypeScript loading, and formatters
test-runner/             Cucumber process launcher and report configuration
utils/                   Reserved for small shared test utilities
reports/                 Generated Cucumber HTML and JSON reports
screenshots/             Screenshots captured when scenarios fail
playwright.config.ts     Shared Playwright Test configuration; not the BDD runner
tsconfig.json            TypeScript compiler and ts-node settings
package.json             Dependencies and npm commands
```

`login.feature` defines the smoke and regression scenarios. Gherkin expresses behavior in `Given`, `When`, and `Then` steps; the step definitions bind those steps to `LoginPage`. The page object owns selectors and UI actions. Cucumber hooks create a Playwright `Browser`, an isolated `BrowserContext`, and a `Page` for each scenario, then close them afterward. The Cucumber runner—not Playwright Test—executes the BDD scenarios and writes the HTML and JSON reports.

## B. Installation

```bash
npm install
```

## C. Install Playwright browsers

Install Chromium (the default browser):

```bash
npx playwright install chromium
```

To use Firefox or WebKit, install them with `npx playwright install firefox` or `npx playwright install webkit`, then set `BROWSER` accordingly.

## D. Configure environments

Choose the environment with `TEST_ENV=qa` (the default) or `TEST_ENV=uat`. The selected file is `config/.env.qa` or `config/.env.uat`. Each file defines `BASE_URL`, `USERNAME`, `PASSWORD`, `BROWSER`, `HEADLESS`, and `TIMEOUT`.

Replace the sample values for your environment. Process environment variables take precedence over values loaded from the file. Do not commit real credentials.

For example:

```bash
TEST_ENV=uat npm run test:bdd
```

## E. Run all BDD tests

```bash
npm run test:bdd
```

The runner discovers all `features/**/*.feature` files. Cucumber continues to other scenarios after a scenario fails and returns a failing exit code if any scenario fails.

> **Use the Cucumber runner for BDD scenarios.** This project uses `@cucumber/cucumber`; it does not use the `playwright-bdd` adapter. If you see `No BDD configs found. Did you use defineBddConfig() in playwright.config.ts?`, you are invoking the Playwright BDD adapter instead of this project's Cucumber runner. Run `npm run test:bdd` (or `npx cucumber-js`) instead. `defineBddConfig()` is not needed here.

## F. Run a specific feature

```bash
npx cucumber-js features/login.feature
```

The runner also forwards Cucumber CLI options; for example, `npm run test:bdd -- features/login.feature` uses the project's configured runner and report formatters.

## G. Run a specific tag or scenario

Run the smoke scenario through the configured Cucumber CLI:

```bash
npx cucumber-js --tags "@smoke"
```

Run the invalid-login regression scenario:

```bash
npx cucumber-js --tags "@regression"
```

You can also use the npm runner to select tags or a scenario by name, for example `npm run test:bdd -- --tags @smoke` or `npm run test:bdd -- --name "Successful login"`.

Run the locked-out-user scenario with:

```bash
npm run test:bdd -- --name "Verify error message for locked out user"
```

BDD scenarios are Gherkin features executed by Cucumber. `npx playwright test --grep ...` searches Playwright Test files and does not run Cucumber scenarios.

## H. Run in headed mode

```bash
npm run test:bdd:headed
```

Alternatively, set `HEADLESS=false` in the selected environment file or process environment.

## I. Generate and view the HTML report

Every `test:bdd` run generates:

- `reports/cucumber-report.html` — readable feature, scenario, step, status, duration, and failure details.
- `reports/cucumber-report.json` — machine-readable Cucumber results.

The HTML formatter includes screenshots attached to failed scenarios. Open `reports/cucumber-report.html` in a browser after the run. `npm run test:bdd:html` is an explicit alias for running the same HTML-reporting suite.

## J. Failure screenshots

The `After` hook checks the Cucumber scenario result. For a failed scenario, it saves a full-page PNG under `screenshots/` and attaches the image to the Cucumber report. It then closes the `Page`, `BrowserContext`, and `Browser` even if screenshot capture fails.

## K. End-to-end execution flow

```text
Feature File
     ↓
Cucumber
     ↓
Step Definition
     ↓
Page Object
     ↓
Playwright
     ↓
Browser
     ↓
Application
     ↓
Cucumber Report
```

Cucumber reads Gherkin scenarios and matches each step to a TypeScript step definition. The step definition calls a reusable page-object method. That method uses Playwright's `Page` API to interact with the browser and SauceDemo. Cucumber records step outcomes and execution duration, then generates the HTML and JSON reports. A failed scenario also gets a screenshot attached to its report.

## Additional configuration

- `BROWSER=chromium|firefox|webkit` selects the Playwright browser.
- `HEADLESS=true|false` controls headed execution.
- `TIMEOUT=30000` sets the action/navigation timeout in milliseconds.
- `npm run typecheck` checks the TypeScript sources without running scenarios.
