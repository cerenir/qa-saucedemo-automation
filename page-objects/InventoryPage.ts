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
  async countProductCards(): Promise<number>{
    return await this.inventoryItems.count();
  }
  async selectSortingOption(option: string): Promise<void> {
  await this.page.locator('[data-test="product-sort-container"]').selectOption(option);
}
  async getAllProductPrices(): Promise<number[]> {
    // 1. Extrae los textos de todos los precios de golpe (ej: ["$29.99", "$9.99", ...])
    const priceTexts = await this.page.locator('.inventory_item_price').allTextContents();
    // 2. Limpia el '$' y los transforma en números reales para poder compararlos matemáticamente
    return priceTexts.map(price => parseFloat(price.replace('$', '')));
  }
  async getAllProductsTittles(): Promise<string[]>{
    return await this.page.locator('.inventory_item_name').allTextContents();
  }
}