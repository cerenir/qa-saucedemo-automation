import { test, expect } from './fixtures';

test('Debería añadir producto al carrito y completar el checkout', async ({ loggedPage }) => {
  await loggedPage.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await loggedPage.locator('[data-test="shopping-cart-link"]').click();
  await expect(loggedPage.locator('[data-test="item-0-title-link"]')).toBeVisible();
  await loggedPage.getByText('Continue ShoppingCheckout').click();
  await loggedPage.locator('[data-test="checkout"]').click();
  await loggedPage.locator('[data-test="firstName"]').click();
  await loggedPage.locator('[data-test="firstName"]').fill('Pepito');
  await loggedPage.locator('[data-test="lastName"]').click();
  await loggedPage.locator('[data-test="lastName"]').fill('Perez');
  await loggedPage.locator('[data-test="postalCode"]').click();
  await loggedPage.locator('[data-test="postalCode"]').fill('28801');
  await loggedPage.locator('[data-test="continue"]').click();
  await loggedPage.locator('[data-test="finish"]').click();
  await expect(loggedPage.locator('[data-test="complete-header"]')).toBeVisible();
  await expect(loggedPage.locator('[data-test="pony-express"]')).toBeVisible();
  await loggedPage.locator('[data-test="back-to-products"]').click();
});
