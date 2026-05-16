import { test as base, Page } from '@playwright/test'; // 1. Importamos 'Page'
import { LoginPage } from '../../page-objects/LoginPage';

// 1. Definimos qué "servicios" nuevos va a tener nuestro test
type MyFixtures = {
  loggedPage: Page; // 2. Cambiamos 'any' por 'Page' para que quede más pro
};

// 2. Extendemos el "test" base de Playwright
export const test = base.extend<MyFixtures>({
  // 3. Le decimos a TypeScript que 'page' es de tipo 'Page'
  loggedPage: async ({ page }: { page: Page }, use) => {
    // Aquí ocurre la magia antes del test:
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    
    // Le "entregamos" la página ya logueada al test
    await use(page);
  },
});

export { expect } from '@playwright/test';