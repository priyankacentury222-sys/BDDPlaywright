import path from 'node:path';
import dotenv from 'dotenv';

const testEnvironment = process.env.TEST_ENV ?? 'qa';
if (testEnvironment !== 'qa' && testEnvironment !== 'uat') {
  throw new Error(`Unsupported TEST_ENV "${testEnvironment}". Use "qa" or "uat".`);
}

dotenv.config({
  path: path.resolve(process.cwd(), 'config', `.env.${testEnvironment}`),
  quiet: true,
});

function requiredEnvironmentValue(
  name: 'BASE_URL' | 'USERNAME' | 'PASSWORD' | 'LOCKED_OUT_USERNAME',
): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} must be set in config/.env.${testEnvironment} or the process environment.`);
  }
  return value;
}

function timeoutFromEnvironment(): number {
  const timeout = Number(process.env.TIMEOUT ?? '30000');
  if (!Number.isFinite(timeout) || timeout <= 0) {
    throw new Error('TIMEOUT must be a positive number of milliseconds.');
  }
  return timeout;
}

function browserNameFromEnvironment(): 'chromium' | 'firefox' | 'webkit' {
  const browserName = process.env.BROWSER ?? 'chromium';
  if (browserName !== 'chromium' && browserName !== 'firefox' && browserName !== 'webkit') {
    throw new Error(`Unsupported BROWSER "${browserName}". Use "chromium", "firefox", or "webkit".`);
  }
  return browserName;
}

export const frameworkConfig = {
  testEnvironment,
  baseUrl: requiredEnvironmentValue('BASE_URL'),
  username: requiredEnvironmentValue('USERNAME'),
  password: requiredEnvironmentValue('PASSWORD'),
  lockedOutUsername: requiredEnvironmentValue('LOCKED_OUT_USERNAME'),
  browserName: browserNameFromEnvironment(),
  headless: process.argv.includes('--headed')
    ? false
    : (process.env.HEADLESS ?? 'true').toLowerCase() !== 'false',
  timeout: timeoutFromEnvironment(),
  reportsDir: path.resolve(process.cwd(), 'reports'),
  screenshotsDir: path.resolve(process.cwd(), 'screenshots'),
};
