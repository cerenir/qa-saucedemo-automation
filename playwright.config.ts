/** @ Scranton/types/node */
declare var process: any;
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0, 
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'https://www.saucedemo.com', 
    trace: 'on-first-retry',           
    screenshot: 'only-on-failure',     
    video: 'retain-on-failure',        
  },
  projects: [
    {
      name: 'ui-chromium',
      testMatch: /.*tests\/ui\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'ui-firefox',
      testMatch: /.*tests\/ui\/.*\.spec\.ts/,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'ui-webkit',
      testMatch: /.*tests\/ui\/.*\.spec\.ts/,
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'api-tests',
      testMatch: /.*tests\/api\/.*\.spec\.ts/,
      use: {
        // Ponemos la URL base de la nueva API aquí
        baseURL: 'https://jsonplaceholder.typicode.com', 
      },
    },
  ],
});