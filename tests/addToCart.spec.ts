import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  // Arranca directamente en la aplicación autenticada
  await page.goto('https://www.saucedemo.com');


  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await expect(page.locator('[data-test="item-0-title-link"]')).toBeVisible();
  await page.getByText('Continue ShoppingCheckout').click();
  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="firstName"]').click();
  await page.locator('[data-test="firstName"]').fill('Pepito');
  await page.locator('[data-test="lastName"]').click();
  await page.locator('[data-test="lastName"]').fill('Perez');
  await page.locator('[data-test="postalCode"]').click();
  await page.locator('[data-test="postalCode"]').fill('28801');
  await page.locator('[data-test="continue"]').click();
  await page.locator('[data-test="finish"]').click();
  await expect(page.locator('[data-test="complete-header"]')).toBeVisible();
  await expect(page.locator('[data-test="pony-express"]')).toBeVisible();
  await page.locator('[data-test="back-to-products"]').click();
});
