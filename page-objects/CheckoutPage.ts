import { type Locator, type Page } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly successHeader: Locator;
  readonly errorHeader: Locator;
  readonly successImage: Locator;
  readonly cancelButton: Locator;
  readonly itemPrices: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.successHeader = page.locator('[data-test="complete-header"]');
    this.errorHeader = page.locator('[data-test="error"]');
    this.successImage = page.locator('[data-test="pony-express"]');
    this.itemPrices = page.locator('.inventory_item_price');
    this.subtotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
  }

  async fillCustomerInformation(firstName: string, lastName: string, zipCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(zipCode);
    await this.continueButton.click();
  }

  async finishOrder() {
    await this.finishButton.click();
  }
  async obtenerSubtotalCalculado(): Promise<number> {
    // 1. Extraemos todos los textos de golpe (evita flakiness)
    const textosPrecios = await this.itemPrices.allTextContents();
    
    // 2. Parseamos y sumamos usando reduce
    const subtotal = textosPrecios.reduce((acumulado, texto) => {
      const precioLimpio = parseFloat(texto.replace('$', ''));
      return acumulado + precioLimpio;
    }, 0);

    return subtotal;
  }

  /**
   * Extrae el valor numérico del subtotal que pinta la web (Item total: $XX.XX)
   */
  async obtenerSubtotalDePantalla(): Promise<number> {
    const textoSubtotal = await this.subtotalLabel.textContent();
    if (!textoSubtotal) throw new Error('No se pudo obtener el subtotal de la pantalla');
    
    // Limpiamos el texto eliminando todo lo que no sea número o punto decimal
    const valorLimpio = textoSubtotal.replace(/[^0-9.]/g, '');
    return parseFloat(valorLimpio);
  }
  
}