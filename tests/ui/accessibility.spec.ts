
import { test, expect } from './fixtures';
import { AxeBuilder } from '@axe-core/playwright';

test.describe('Accesibilidad de la página de inventario', () => {
  test('debe cumplir con las normas de accesibilidad WCAG', async ({ loggedPage }) => {
    // La fixture 'loggedPage' ya nos deja en inventory.html
    
    // Ejecutar el análisis de accesibilidad
    const accessibilityScanResults = await new AxeBuilder({ page: loggedPage })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    // Comprobar si hay violaciones
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
