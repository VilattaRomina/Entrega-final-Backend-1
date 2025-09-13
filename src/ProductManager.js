import fs from "fs/promises";
import { randomUUID } from "crypto";

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async readFile() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async addProduct(product) {
    const products = await this.readFile();
    
    const newProduct = {
      id: randomUUID(),
      ...product
    };

    products.push(newProduct);
    await this.writeFile(products);
    return newProduct;
  }

  async getProducts() {
    return await this.readFile();
  }

  async getProductById(id) {
    const products = await this.readFile();
    return products.find((product) => product.id === id);
  }

  async updateProduct(id, updates) {
    const products = await this.readFile();
    const index = products.findIndex((p) => p.id === id);
    
    if (index === -1) return null;

    products[index] = { 
      ...products[index], 
      ...updates,
      id: products[index].id 
    };
    
    await this.writeFile(products);
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.readFile();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return false;

    products.splice(index, 1);
    await this.writeFile(products);
    return true;
  }
}
