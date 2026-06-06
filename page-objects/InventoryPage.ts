import { type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly addToCartButtons: Locator;
  readonly sortDropdown: Locator;
  readonly inventoryList: Locator;
  readonly inventoryItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.addToCartButtons = page.locator('button[data-test^="add-to-cart-"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.inventoryList = page.locator('[data-test="inventory-list"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
  }

  // Usamos un método dinámico para poder añadir CUALQUIER producto pasando su ID por parámetro
  async addItemToCart(productName: string) {
    const addToCartButton = this.page.locator(`[data-test="add-to-cart-${productName}"]`);
    await addToCartButton.click();
  }

  async addRandomItemToCart(): Promise<string> {
    await this.addToCartButtons.first().waitFor();
    const totalProducts = await this.addToCartButtons.count();
    const randomIndex = Math.floor(Math.random() * totalProducts);
    const selectedButton = this.addToCartButtons.nth(randomIndex);
    const selectedDataTest = await selectedButton.getAttribute('data-test');
    const productName = selectedDataTest!.replace('add-to-cart-', '');
    await selectedButton.click();
    return productName;
  }
  async removeItemFromCart(productName: string) {
    const removeButton = this.page.locator(`[data-test="remove-${productName}"]`);
    await removeButton.click();
  }
  async getCartBadgeCount(): Promise<string> {
    return await this.cartBadge.innerText();
  }

  async goToCart() {
    await this.cartLink.click();
  }
}