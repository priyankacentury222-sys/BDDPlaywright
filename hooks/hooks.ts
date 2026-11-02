import {
  After,
  Before,
  Status,
  World,
  setWorldConstructor,
} from '@cucumber/cucumber';
import type { Browser, BrowserContext, Page } from 'playwright';
import { chromium, firefox, webkit } from 'playwright';
import { frameworkConfig } from '../config/config';
import { LoginPage } from '../pages/LoginPage';

// A Browser is the launched browser process; each scenario gets an isolated BrowserContext and Page.
export class PlaywrightWorld extends World {
  browser: Browser | undefined;
  context: BrowserContext | undefined;
  page!: Page;
  loginPage!: LoginPage;
}

setWorldConstructor(PlaywrightWorld);

const browserTypes = { chromium, firefox, webkit };

// Before creates a fresh browser session for each scenario to prevent state leaking between tests.
Before(async function (this: PlaywrightWorld) {
  const browser = await browserTypes[frameworkConfig.browserName].launch({
    headless: frameworkConfig.headless,
  });
  this.browser = browser;
  const context = await browser.newContext();
  this.context = context;
  const page = await context.newPage();
  this.page = page;
  page.setDefaultTimeout(frameworkConfig.timeout);
  page.setDefaultNavigationTimeout(frameworkConfig.timeout);
});

// After captures and attaches failure screenshots, then closes every browser resource.
After(async function (this: PlaywrightWorld, { result, pickle }) {
  try {
    if (result?.status === Status.FAILED && this.page) {
      const fileName = `${pickle.name}-${Date.now()}`
        .replace(/[^a-zA-Z0-9._-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      const screenshot = await this.page.screenshot({
        path: `${frameworkConfig.screenshotsDir}/${fileName}.png`,
        fullPage: true,
      });
      await this.attach(screenshot, 'image/png');
    }
  } catch (error) {
    console.error(`Unable to capture scenario failure screenshot: ${String(error)}`);
  } finally {
    try {
      await this.page?.close();
    } finally {
      try {
        await this.context?.close();
      } finally {
        await this.browser?.close();
      }
    }
  }
});
