import { type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  // Usamos un método dinámico para poder añadir CUALQUIER producto pasando su ID por parámetro
  async addItemToCart(productName: string) {
    const addToCartButton = this.page.locator(`[data-test="add-to-cart-${productName}"]`);
    await addToCartButton.click();
  }

  async goToCart() {
    await this.cartLink.click();
  }
}