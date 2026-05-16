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
    // Ponemos la URL de Sauce Demo aquí para centralizarla
    baseURL: 'https://www.saucedemo.com', 
    trace: 'on-first-retry',           
    screenshot: 'only-on-failure',     
    video: 'retain-on-failure',        
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }, // Limpio de dependencias y storageState
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }, // Limpio
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }, // Limpio
    },
  ],
});