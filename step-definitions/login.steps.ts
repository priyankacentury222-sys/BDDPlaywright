import { Given, When, Then } from '@cucumber/cucumber';
import { frameworkConfig } from '../config/config';
import { LoginPage } from '../pages/LoginPage';
import type { PlaywrightWorld } from '../hooks/hooks';

// Step definitions connect human-readable Gherkin steps to reusable page-object methods.
Given('I navigate to the login page', async function (this: PlaywrightWorld) {
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.navigateToLoginPage(frameworkConfig.baseUrl);
});

When('I enter valid username and password', async function (this: PlaywrightWorld) {
  await this.loginPage.enterUsername(frameworkConfig.username);
  await this.loginPage.enterPassword(frameworkConfig.password);
});

When('I enter invalid username and password', async function (this: PlaywrightWorld) {
  await this.loginPage.enterUsername('invalid_user');
  await this.loginPage.enterPassword('invalid_password');
});

When('I enter locked out user credentials', async function (this: PlaywrightWorld) {
  await this.loginPage.enterUsername(frameworkConfig.lockedOutUsername);
  await this.loginPage.enterPassword(frameworkConfig.password);
});

When('I click the login button', async function (this: PlaywrightWorld) {
  await this.loginPage.clickLogin();
});

Then('I should be successfully logged in', async function (this: PlaywrightWorld) {
  await this.loginPage.verifySuccessfulLogin();
});

Then('I should see a login error message', async function (this: PlaywrightWorld) {
  await this.loginPage.verifyLoginError(
    'Epic sadface: Username and password do not match any user in this service',
  );
});

Then('I should see the locked out user error message', async function (this: PlaywrightWorld) {
  await this.loginPage.verifyLoginError(
    'Epic sadface: Sorry, this user has been locked out.',
  );
});
