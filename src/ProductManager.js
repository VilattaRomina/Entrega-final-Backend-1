import { Product } from './models/product.model.js';

export default class ProductManager {
  
  async getProducts({ limit = 10, page = 1, sort, query } = {}) {
    try {
      const filter = {};
      
      if (query) {
        if (query.category) {
          filter.category = query.category;
        }
        if (query.status !== undefined) {
          filter.status = query.status;
        }
      }
      
      const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        lean: true
      };
      
      if (sort) {
        options.sort = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};
      }
      
      return await Product.paginate(filter, options);
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
  }

  async getProductById(id) {
    try {
      return await Product.findById(id);
    } catch (error) {
      throw new Error(`Error al obtener producto: ${error.message}`);
    }
  }

  async addProduct(product) {
    try {
      const newProduct = await Product.create(product);
      return newProduct;
    } catch (error) {
      throw new Error(`Error al agregar producto: ${error.message}`);
    }
  }

  async updateProduct(id, updates) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
      );
      return updatedProduct;
    } catch (error) {
      throw new Error(`Error al actualizar producto: ${error.message}`);
    }
  }

  async deleteProduct(id) {
    try {
      const result = await Product.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  }
}
