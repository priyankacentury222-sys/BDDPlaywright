// Cucumber CLI defaults make direct commands (including --tags) use the same setup as the npm runner.
module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['hooks/**/*.ts', 'step-definitions/**/*.ts'],
    format: [
      'progress',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json',
    ],
    parallel: 1,
  },
};
