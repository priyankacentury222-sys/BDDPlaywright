import assert from 'node:assert/strict';
import type { Page } from 'playwright';

// The Page Object Model keeps page selectors and UI actions out of step definitions.
export class LoginPage {
  private readonly usernameInput;
  private readonly passwordInput;
  private readonly loginButton;
  private readonly inventoryHeading;
  private readonly errorMessage;

  // A Playwright Page is one browser tab; this class owns its selectors and interactions.
  constructor(private readonly page: Page) {
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.inventoryHeading = page.getByText('Products', { exact: true });
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async navigateToLoginPage(baseUrl: string): Promise<void> {
    await this.page.goto(baseUrl);
  }

  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async verifySuccessfulLogin(): Promise<void> {
    await this.page.waitForURL('**/inventory.html');
    await this.inventoryHeading.waitFor({ state: 'visible' });
  }

  async verifyLoginError(expectedMessage: string): Promise<void> {
    await this.errorMessage.waitFor({ state: 'visible' });
    const actualMessage = (await this.errorMessage.textContent())?.trim();
    assert.equal(actualMessage, expectedMessage);
  }
}
