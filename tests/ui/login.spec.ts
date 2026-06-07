import { test, expect } from '@playwright/test';
import { LoginPage } from '../../page-objects/LoginPage';

test.describe('Flujo de Autenticación', () => {
  
  test('Debería permitir iniciar sesión con un usuario válido', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    
    // Verificamos que el login fue exitoso comprobando que la URL cambió
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('Debería mostrar un error con credenciales incorrectas', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.login('usuario_falso', 'password_incorrecto');
    
    // Verificamos que el mensaje de error sea visible
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Epic sadface');
  });
  test('Debería salir de la sesion correctamente al pulsar en Logout', async({ page}) =>{
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    await loginPage.logout();
    await expect(page).toHaveURL(/saucedemo.com/);
  })
});