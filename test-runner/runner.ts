import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { frameworkConfig } from '../config/config';

// Cucumber remains the BDD runner; this launcher supplies environment settings and forwards CLI filters.
async function run(): Promise<void> {
  await Promise.all([
    mkdir(frameworkConfig.reportsDir, { recursive: true }),
    mkdir(frameworkConfig.screenshotsDir, { recursive: true }),
  ]);

  const cucumberEntryPoint = require.resolve('@cucumber/cucumber');
  const cucumberCli = path.resolve(path.dirname(cucumberEntryPoint), '../bin/cucumber.js');
  const forwardedArguments = process.argv.slice(2).filter((argument) => argument !== '--headed');
  const cucumberArguments = [cucumberCli, ...forwardedArguments];

  const environment = {
    ...process.env,
    HEADLESS: frameworkConfig.headless ? 'true' : 'false',
  };
  const child = spawn(process.execPath, cucumberArguments, {
    cwd: process.cwd(),
    env: environment,
    stdio: 'inherit',
  });

  child.once('error', (error) => {
    console.error(`Unable to start Cucumber: ${error.message}`);
    process.exitCode = 1;
  });
  child.once('exit', (code, signal) => {
    if (signal) {
      console.error(`Cucumber was terminated by signal ${signal}.`);
      process.exitCode = 1;
    } else {
      process.exitCode = code ?? 1;
    }
  });
}

void run().catch((error: unknown) => {
  console.error(`BDD runner failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
