import { Cart } from './models/cart.model.js';

export default class CartManager {
  
  async createCart() {
    try {
      const newCart = await Cart.create({ products: [] });
      return newCart;
    } catch (error) {
      throw new Error(`Error al crear carrito: ${error.message}`);
    }
  }

  async getCartById(id) {
    try {
      const cart = await Cart.findById(id).populate('products.product');
      return cart;
    } catch (error) {
      throw new Error(`Error al obtener carrito: ${error.message}`);
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      const productIndex = cart.products.findIndex(
        item => item.product.toString() === productId
      );

      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`Error al agregar producto al carrito: ${error.message}`);
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      cart.products = cart.products.filter(
        item => item.product.toString() !== productId
      );

      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`Error al eliminar producto del carrito: ${error.message}`);
    }
  }

  async updateCart(cartId, products) {
    try {
      const cart = await Cart.findByIdAndUpdate(
        cartId,
        { products },
        { new: true, runValidators: true }
      );
      
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      
      return cart;
    } catch (error) {
      throw new Error(`Error al actualizar carrito: ${error.message}`);
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      const productIndex = cart.products.findIndex(
        item => item.product.toString() === productId
      );

      if (productIndex === -1) {
        throw new Error('Producto no encontrado en el carrito');
      }

      cart.products[productIndex].quantity = quantity;

      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`Error al actualizar cantidad del producto: ${error.message}`);
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await Cart.findByIdAndUpdate(
        cartId,
        { products: [] },
        { new: true }
      );
      
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      
      return cart;
    } catch (error) {
      throw new Error(`Error al vaciar carrito: ${error.message}`);
    }
  }
}

