/** @ Scranton/types/node */
declare var process: any;
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0, // Reintenta en CI para evitar falsos negativos
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'https://www.google.com', // Cambiarás esto en cada proyecto
    trace: 'on-first-retry',           // Te permite ver qué pasó paso a paso si falla
    screenshot: 'only-on-failure',     // Evita llenar el disco, solo captura errores
    video: 'retain-on-failure',        // Muy útil para depurar en GitHub Actions
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});