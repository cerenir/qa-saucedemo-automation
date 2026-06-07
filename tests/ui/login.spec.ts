import { test, expect } from '@playwright/test';
import { LoginPage } from '../../page-objects/LoginPage';

test.describe('Flujo de Autenticación - Data Driven', () => {
  
  // 1. Matriz de datos para TODOS los caminos tristes (Errores)
  const loginTestData = [
    {
      escenario: 'Usuario bloqueado',
      user: 'locked_out_user',
      pass: 'secret_sauce',
      expectedError: 'Epic sadface: Sorry, this user has been locked out.',
    },
    {
      escenario: 'Credenciales incorrectas',
      user: 'usuario_falso',
      pass: 'password_incorrecto',
      expectedError: 'Epic sadface: Username and password do not match any user in this service',
    },
    {
      escenario: 'Usuario en blanco',
      user: '',
      pass: 'secret_sauce',
      expectedError: 'Epic sadface: Username is required',
    },
    {
      escenario: 'Contraseña en blanco',
      user: 'standard_user',
      pass: '',
      expectedError: 'Epic sadface: Password is required',
    },
  ];

  // 2. Ejecución dinámica de los errores (Sustituye a los 4 tests individuales antiguos)
  for (const data of loginTestData) {
    test(`Login Fallido - ${data.escenario}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      
      await loginPage.goto();
      await loginPage.login(data.user, data.pass);
      
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText(data.expectedError);
    });
  }

  // 3. Casos únicos que NO son redundantes (Tienen flujos o aserciones distintas)
  
  test('Debería permitir iniciar sesión con un usuario válido', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('Debería salir de la sesion correctamente al pulsar en Logout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    await loginPage.logout();
    await expect(page).toHaveURL(/saucedemo.com/);
  });
});