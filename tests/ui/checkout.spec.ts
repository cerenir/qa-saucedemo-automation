import { test, expect } from './fixtures';
import { InventoryPage } from '../../page-objects/InventoryPage'; // Asegúrate de ajustar la ruta
import { CartPage } from '../../page-objects/CartPage';
import { CheckoutPage } from '../../page-objects/CheckoutPage';

// Agrupamos todos los tests relacionados con el proceso de compra
test.describe('Flujos del proceso de Checkout', () => {

  test('Debería completar la compra exitosamente', async ({ loggedPage }) => {

    const inventoryPage = new InventoryPage(loggedPage);
    const cartPage = new CartPage(loggedPage);
    const checkoutPage = new CheckoutPage(loggedPage);

    await inventoryPage.addItemToCart('sauce-labs-bike-light');
    await inventoryPage.goToCart();

    await expect(cartPage.getCartItemTitle()).toHaveText('Sauce Labs Bike Light');  
    await cartPage.goToCheckout();
    await checkoutPage.fillCustomerInformation('Carlos', 'Rius', '08001');
    await checkoutPage.finishOrder();

    // Validamos que el pedido se ha completado correctamente
    await expect(checkoutPage.successHeader).toHaveText('Thank you for your order!');
    await expect(checkoutPage.successImage).toBeVisible();

  });
  test('Debería mostrar error si el campo nombre del formulario está vacío', async ({ loggedPage }) => {
    const inventoryPage = new InventoryPage(loggedPage);
    const cartPage = new CartPage(loggedPage);
    const checkoutPage = new CheckoutPage(loggedPage);

    await inventoryPage.addItemToCart('sauce-labs-bike-light');
    await inventoryPage.goToCart();

    await expect(cartPage.getCartItemTitle()).toHaveText('Sauce Labs Bike Light');  
    await cartPage.goToCheckout();
    await checkoutPage.fillCustomerInformation('', 'Rius', '08001');
    
    // Validamos que el pedido se ha completado correctamente
    await expect(checkoutPage.errorHeader).toHaveText('Error: First Name is required');
    
  });
  test('Debería mostrar error si el campo apellido del formulario está vacío', async ({ loggedPage }) => {
    const inventoryPage = new InventoryPage(loggedPage);
    const cartPage = new CartPage(loggedPage);
    const checkoutPage = new CheckoutPage(loggedPage);

    await inventoryPage.addItemToCart('sauce-labs-bike-light');
    await inventoryPage.goToCart();

    await expect(cartPage.getCartItemTitle()).toHaveText('Sauce Labs Bike Light');  
    await cartPage.goToCheckout();
    await checkoutPage.fillCustomerInformation('Carlos', '', '08001');
    
    // Validamos que el pedido se ha completado correctamente
    await expect(checkoutPage.errorHeader).toHaveText('Error: Last Name is required');
    
  });
  test('Debería mostrar error si el campo código postal del formulario está vacío', async ({ loggedPage }) => {
    const inventoryPage = new InventoryPage(loggedPage);
    const cartPage = new CartPage(loggedPage);
    const checkoutPage = new CheckoutPage(loggedPage);

    await inventoryPage.addItemToCart('sauce-labs-bike-light');
    await inventoryPage.goToCart();

    await expect(cartPage.getCartItemTitle()).toHaveText('Sauce Labs Bike Light');  
    await cartPage.goToCheckout();
    await checkoutPage.fillCustomerInformation('Carlos', 'Rius', '');
    
    // Validamos que el pedido se ha completado correctamente
    await expect(checkoutPage.errorHeader).toHaveText('Error: Postal Code is required');
    
  });
});
