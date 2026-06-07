import { test, expect } from './fixtures';
import { InventoryPage } from '../../page-objects/InventoryPage'; 
import { CartPage } from '../../page-objects/CartPage';
import { CheckoutPage } from '../../page-objects/CheckoutPage';
import { faker } from '@faker-js/faker';

// =========================================================================
// BLOQUE 1: TODO LO RELACIONADO CON CHECKOUT Y FORMULARIOS (SMOKE)
// =========================================================================
test.describe('Flujos del proceso de Checkout', { tag: '@smoke' }, () => {

  // SUB-BLOQUE A: Flujo feliz que requiere pre-condiciones de compra pesadas
  test.describe('Compra Exitosa', () => {
    test.beforeEach(async ({ loggedPage }) => {
      const inventoryPage = new InventoryPage(loggedPage);
      const cartPage = new CartPage(loggedPage);

      await inventoryPage.addItemToCart('sauce-labs-bike-light');
      await inventoryPage.goToCart();
      await expect(cartPage.getCartItemTitle()).toHaveText('Sauce Labs Bike Light');  
      await cartPage.goToCheckout();
    });

    test('Debería completar la compra exitosamente', async ({ loggedPage }) => {
      const checkoutPage = new CheckoutPage(loggedPage);
      
      await checkoutPage.fillCustomerInformation('Carlos', 'Rius', '08001');
      
      const subtotalCalculado = await checkoutPage.obtenerSubtotalCalculado();
      const subtotalPantalla = await checkoutPage.obtenerSubtotalDePantalla();
      expect(subtotalCalculado).toBeCloseTo(subtotalPantalla, 2);
      
      await checkoutPage.finishOrder();

      await expect(checkoutPage.successHeader).toHaveText('Thank you for your order!');
      await expect(checkoutPage.successImage).toBeVisible();
    });
  });

  // SUB-BLOQUE B: Validaciones de formulario (Solo van directos a la URL, sin meter productos)
  test.describe('Validaciones de Campos Obligatorios', () => {
    test.beforeEach(async ({ loggedPage }) => {
      await loggedPage.goto('/cart.html');
      const cartPage = new CartPage(loggedPage);
      await cartPage.goToCheckout();
    });

    test('Debería mostrar error si el campo nombre del formulario está vacío', async ({ loggedPage }) => {
      const checkoutPage = new CheckoutPage(loggedPage); // SOLO instanciamos lo que usamos
      await checkoutPage.fillCustomerInformation('', faker.person.lastName(), '08001');
      await expect(checkoutPage.errorHeader).toHaveText('Error: First Name is required');
    });

    test('Debería mostrar error si el campo apellido del formulario está vacío', async ({ loggedPage }) => {
      const checkoutPage = new CheckoutPage(loggedPage);
      await checkoutPage.fillCustomerInformation(faker.person.firstName(), '', faker.location.zipCode());
      await expect(checkoutPage.errorHeader).toHaveText('Error: Last Name is required');
    });

    test('Debería mostrar error si el campo código postal del formulario está vacío', async ({ loggedPage }) => {
      const checkoutPage = new CheckoutPage(loggedPage);
      await checkoutPage.fillCustomerInformation(faker.person.firstName(), faker.person.lastName(), '');
      await expect(checkoutPage.errorHeader).toHaveText('Error: Postal Code is required');
    });
  });
});

// =========================================================================
// BLOQUE 2: COMPORTAMIENTO DE LA UI Y NAVEGACIÓN (INVENTARIO / CARRITO)
// =========================================================================
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
    const products = ['sauce-labs-backpack', 'sauce-labs-bike-light', 'sauce-labs-bolt-t-shirt'];
    
    for (const [index, product] of products.entries()) {
      await inventoryPage.addItemToCart(product);
      await expect(inventoryPage.cartBadge).toHaveText((index + 1).toString());
    }

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

  test('Debería haber 6 productos en total en la página de inventario', async ({ loggedPage }) => {
    const inventoryPage = new InventoryPage(loggedPage);
    const totalProducts = await inventoryPage.countProductCards();
    expect(totalProducts).toBe(6);
  });

test('Debería mantener la consistencia del carrito al navegar hacia atrás en el historial', async ({ loggedPage }) => {
    const inventoryPage = new InventoryPage(loggedPage);
    const cartPage = new CartPage(loggedPage);
    const productoTest = 'sauce-labs-bike-light';
    const textoEsperado = 'Sauce Labs Bike Light';


    // 1. Añadimos producto en inventario y vamos al carrito
    await inventoryPage.addItemToCart(productoTest);
    await inventoryPage.goToCart();
    await loggedPage.goBack();

    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.goToCart();
    await expect(cartPage.getCartItemTitle()).toHaveText(textoEsperado);
  });

  test('Debería ordenar correctamente los productos por precio de menor a mayor ', async ({ loggedPage }) => {
    const inventoryPage = new InventoryPage(loggedPage);
    await inventoryPage.selectSortingOption('lohi');
    const preciosPantalla = await inventoryPage.getAllProductPrices();
    
    for(let i = 0; i < preciosPantalla.length -1; i++){
      expect(preciosPantalla[i]).toBeLessThanOrEqual(preciosPantalla[i+1]);
    }
  });

   test('Debería ordenar correctamente los productos por precio de mayor a menor ', async ({ loggedPage }) => {
    const inventoryPage = new InventoryPage(loggedPage);
    await inventoryPage.selectSortingOption('hilo');
    const preciosPantalla = await inventoryPage.getAllProductPrices();
    
    for(let i = 0; i < preciosPantalla.length -1; i++){
      expect(preciosPantalla[i]).toBeGreaterThanOrEqual(preciosPantalla[i+1]);
    }
  });

  test('Debería ordenar correctamente los productos de A a Z ', async ({ loggedPage }) => {
    const inventoryPage = new InventoryPage(loggedPage);
    await inventoryPage.selectSortingOption('az');
    const screenNames = await inventoryPage.getAllProductsTittles();
    
    for(let i = 0; i < screenNames.length -1; i++){
      const comparacion = screenNames[i].localeCompare(screenNames[i+1]);
      expect(comparacion).toBeLessThanOrEqual(0);
    }
  });


});