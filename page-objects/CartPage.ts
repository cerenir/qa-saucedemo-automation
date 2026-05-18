import { type Locator, type Page } from '@playwright/test';


export class CartPage {
  readonly page: Page;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
   }

  // Este método ya no valida nada, solo devuelve el localizador del título del artículo
  getCartItemTitle(): Locator {
    return this.page.locator('[data-test="item-0-title-link"]');
  }

  async continueShopping() {
    await this.page.getByText('Continue ShoppingCheckout').click();
  }
  async removeItemFromCart(productName: string) {
    const removeButton = this.page.locator(`[data-test="remove-${productName}"]`);
    await removeButton.click();
  }

  async goToCheckout() {
    await this.page.locator('[data-test="checkout"]').click();
  }
}