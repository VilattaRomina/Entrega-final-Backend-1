import { Router } from 'express';
import CartManager from '../../CartManager.js';

const router = Router();
const cartManager = new CartManager();

// POST /api/carts - Crear un nuevo carrito
router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    
    res.status(201).json({
      status: 'success',
      payload: newCart
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET /api/carts/:cid - Obtener un carrito por su ID
router.get('/:cid', async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Carrito no encontrado'
      });
    }
    
    res.json({
      status: 'success',
      payload: cart
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// POST /api/carts/:cid/products/:pid - Agregar un producto a un carrito
router.post('/:cid/products/:pid', async (req, res) => {
  try {
    const { quantity = 1 } = req.body;
    const cart = await cartManager.addProductToCart(
      req.params.cid, 
      req.params.pid, 
      parseInt(quantity)
    );
    
    res.json({
      status: 'success',
      payload: cart
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// DELETE /api/carts/:cid/products/:pid - Eliminar un producto de un carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const cart = await cartManager.removeProductFromCart(
      req.params.cid, 
      req.params.pid
    );
    
    res.json({
      status: 'success',
      payload: cart
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// PUT /api/carts/:cid - Actualizar el carrito
router.put('/:cid', async (req, res) => {
  try {
    const { products } = req.body;
    
    if (!Array.isArray(products)) {
      return res.status(400).json({
        status: 'error',
        message: 'El campo products debe ser un arreglo'
      });
    }
    
    const cart = await cartManager.updateCart(req.params.cid, products);
    
    res.json({
      status: 'success',
      payload: cart
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// PUT /api/carts/:cid/products/:pid - Actualizar la cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { quantity } = req.body;
    
    if (!quantity || typeof quantity !== 'number') {
      return res.status(400).json({
        status: 'error',
        message: 'La cantidad debe ser un número válido'
      });
    }
    
    const cart = await cartManager.updateProductQuantity(
      req.params.cid, 
      req.params.pid, 
      quantity
    );
    
    res.json({
      status: 'success',
      payload: cart
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// DELETE /api/carts/:cid - Vaciar un carrito
router.delete('/:cid', async (req, res) => {
  try {
    const cart = await cartManager.clearCart(req.params.cid);
    
    res.json({
      status: 'success',
      payload: cart
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;

