const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    headless: false,
    slowMo: 1000,
    viewport: { width: 1280, height: 720 },
    video: 'on',
  },
  reporter: [['list']],
});