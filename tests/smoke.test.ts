import { test, expect } from '@playwright/test';

test('verificar que la página carga correctamente', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Google/);
});