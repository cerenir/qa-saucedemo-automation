import { test, expect } from './fixtures';
import { InventoryPage } from '../../page-objects/InventoryPage'; // Asegúrate de ajustar la ruta
import { CartPage } from '../../page-objects/CartPage';
import { CheckoutPage } from '../../page-objects/CheckoutPage';
import { faker } from '@faker-js/faker';

// Agrupamos todos los tests relacionados con el proceso de compra
test.describe('Flujos del proceso de Checkout', {tag: '@smoke'}, () => {

  test.beforeEach(async ({ loggedPage }) => {
    const inventoryPage = new InventoryPage(loggedPage);
    const cartPage = new CartPage(loggedPage);

    // Agregamos un producto al carrito y vamos a la página de checkout antes de cada test
    await inventoryPage.addItemToCart('sauce-labs-bike-light');
    await inventoryPage.goToCart();
    await expect(cartPage.getCartItemTitle()).toHaveText('Sauce Labs Bike Light');  
    await cartPage.goToCheckout();

  });

  test('Debería completar la compra exitosamente', async ({ loggedPage }) => {
    const checkoutPage = new CheckoutPage(loggedPage);
    
    // 1. Llegamos a la pantalla de Overview
    await checkoutPage.fillCustomerInformation('Carlos', 'Rius', '08001');
    
    // 2. Extraemos los números resolviendo las promesas en orden
    const subtotalCalculado = await checkoutPage.obtenerSubtotalCalculado();
    const subtotalPantalla = await checkoutPage.obtenerSubtotalDePantalla();
    
    // 3. Aserción matemática estricta para decimales
    expect(subtotalCalculado).toBeCloseTo(subtotalPantalla, 2);
    
    // 4. Usamos tu método encapsulado
    await checkoutPage.finishOrder();

    // 5. Verificaciones finales de UI
    await expect(checkoutPage.successHeader).toHaveText('Thank you for your order!');
    await expect(checkoutPage.successImage).toBeVisible();
  });

  test('Debería mostrar error si el campo nombre del formulario está vacío', async ({ loggedPage }) => {
    const inventoryPage = new InventoryPage(loggedPage);
    const cartPage = new CartPage(loggedPage);
    const checkoutPage = new CheckoutPage(loggedPage);

    await checkoutPage.fillCustomerInformation('', faker.person.lastName(), '08001');
    await expect(checkoutPage.errorHeader).toHaveText('Error: First Name is required');
    
  });
  test('Debería mostrar error si el campo apellido del formulario está vacío', async ({ loggedPage }) => {
    const inventoryPage = new InventoryPage(loggedPage);
    const cartPage = new CartPage(loggedPage);
    const checkoutPage = new CheckoutPage(loggedPage);

    await checkoutPage.fillCustomerInformation(faker.person.firstName(), '', faker.location.zipCode()); // Usamos faker para generar un código postal válido
    await expect(checkoutPage.errorHeader).toHaveText('Error: Last Name is required');
    
  });
  test('Debería mostrar error si el campo código postal del formulario está vacío', async ({ loggedPage }) => {
   
    const checkoutPage = new CheckoutPage(loggedPage);

    await checkoutPage.fillCustomerInformation(faker.person.firstName(), faker.person.lastName(), '');
    await expect(checkoutPage.errorHeader).toHaveText('Error: Postal Code is required');
    
  });
  
});

test.describe('Flujos de validaciones de listado de productos', () => {

   test('Debería actualizar el contador de carrito dinámicamente al añadir un producto al carrito', async ({ loggedPage }) => {

    const inventoryPage = new InventoryPage(loggedPage);
    await expect(inventoryPage.cartBadge).toBeHidden();
    const randomProduct = await inventoryPage.addRandomItemToCart();
    console.log(`🧪 El producto elegido aleatoriamente fue: ${randomProduct}`);
    await expect(inventoryPage.cartBadge).toBeVisible();
    await expect(inventoryPage.cartBadge).toHaveText('1');
   
    await inventoryPage.removeItemFromCart(randomProduct);
    await expect(inventoryPage.cartBadge).toBeHidden();

  });

  test('Debería actualizar el contador del carrito al añadir y eliminar varios productos secuencialmente', async ({ loggedPage }) => {
    const inventoryPage = new InventoryPage(loggedPage);
    
    // Lista de productos
    const products = ['sauce-labs-backpack', 'sauce-labs-bike-light', 'sauce-labs-bolt-t-shirt'];
    
    // 1. Añadir productos y verificar incremento
    for (const [index, product] of products.entries()) {
      await inventoryPage.addItemToCart(product);
      await expect(inventoryPage.cartBadge).toHaveText((index + 1).toString());
    }

    // 2. Eliminar productos y verificar decremento
    // Invertimos la lista para eliminar en orden inverso
    const productsToRemove = [...products].reverse();
    for (const [index, product] of productsToRemove.entries()) {
      await inventoryPage.removeItemFromCart(product);
      
      const remainingCount = productsToRemove.length - 1 - index;
      if (remainingCount > 0) {
        await expect(inventoryPage.cartBadge).toHaveText(remainingCount.toString());
      } else {
        await expect(inventoryPage.cartBadge).toBeHidden();
      }
    }
  });

  test('Debería haber 6 productos en total en la página de inventario', async ({loggedPage}) => {
    const inventoryPage = new InventoryPage(loggedPage);
    const totalProducts = await inventoryPage.countProductCards()
    expect(totalProducts).toBe(6);
  });

});
