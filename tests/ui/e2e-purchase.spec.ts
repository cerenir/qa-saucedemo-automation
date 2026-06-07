import { test, expect } from './fixtures';
import { InventoryPage } from '../../page-objects/InventoryPage'; 
import { CartPage } from '../../page-objects/CartPage';
import { CheckoutPage } from '../../page-objects/CheckoutPage';
import { faker } from '@faker-js/faker';

test('Flujo completo de compra exitosa @e2e', async ({ loggedPage }) => {  // 1. ARRANGE: Inicializamos todos los Page Objects que intervienen en la historia
  const inventoryPage = new InventoryPage(loggedPage);
  const cartPage = new CartPage(loggedPage);
  const checkoutPage = new CheckoutPage(loggedPage);

  // 2. ACT & ASSERT: Paso 1 - El usuario añade dos productos específicos
  await inventoryPage.addItemToCart('sauce-labs-backpack');
  await inventoryPage.addItemToCart('sauce-labs-bike-light');
  await expect(inventoryPage.cartBadge).toHaveText('2');

  // Paso 2 - Va al carrito y comprueba que sus productos están ahí antes de avanzar
  await inventoryPage.goToCart();
  // (Aquí podrías meter un assert de que los títulos existen en el carrito si quisieras)
  await cartPage.goToCheckout();

  // Paso 3 - Rellena la información del cliente
  await checkoutPage.fillCustomerInformation('Carlos', 'Rius', '28800'); // ¡Código postal de Alcalá! 😉

  // Paso 4 - Verificaciones financieras estrictas en la pantalla de revisión
  const subtotalCalculado = await checkoutPage.obtenerSubtotalCalculado();
  const subtotalPantalla = await checkoutPage.obtenerSubtotalDePantalla();
  expect(subtotalCalculado).toBeCloseTo(subtotalPantalla, 2);

  // Paso 5 - Finaliza la orden
  await checkoutPage.finishOrder();

  // 3. ASSERT FINAL: Validación del éxito total de la operación
  await expect(checkoutPage.successHeader).toHaveText('Thank you for your order!');
  await expect(checkoutPage.successImage).toBeVisible();
});