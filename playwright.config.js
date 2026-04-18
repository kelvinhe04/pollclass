const { defineConfig } = require('@playwright/test');

const isCI = process.env.CI === 'true';

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60000,
  fullyParallel: false,
  forbidOnly: !!isCI,
  retries: isCI ? 1 : 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'playwright-report/results.json' }]
  ],
  use: {
    baseURL: 'http://localhost:5173',
    headless: isCI,
    slowMo: isCI ? 0 : 500,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  webServer: [
    {
      command: 'cd server && bun run dev',
      port: 3001,
      timeout: 120000,
      stdout: 'pipe',
      stderr: 'pipe',
      reuseExistingServer: !isCI,
      env: {
        PORT: '3001',
        NODE_ENV: isCI ? 'test' : 'development',
        MONGODB_URI: 'mongodb://localhost:27017/pollclass'
      }
    },
    {
      command: 'cd client && bun run dev',
      port: 5173,
      timeout: 120000,
      stdout: 'pipe',
      stderr: 'pipe',
      reuseExistingServer: !isCI,
      env: {
        VITE_API_BASE_URL: 'http://127.0.0.1:3001'
      }
    }
  ],
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
