import { Router } from 'express';
import ProductManager from '../ProductManager.js';
import CartManager from '../CartManager.js';

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

// GET / - Redirigir a productos
router.get('/', (req, res) => {
  res.redirect('/products');
});

// GET /realtimeproducts 
router.get('/realtimeproducts', async (req, res) => {
  try {
    const result = await productManager.getProducts();
    res.render('realTimeProducts', { 
      title: 'Productos en Tiempo Real - Mi Tienda',
      products: result.docs 
    });
  } catch (error) {
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Error al cargar los productos' 
    });
  }
});

// GET /products - Vista con paginación
router.get('/products', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort,
      query: query ? JSON.parse(query) : undefined
    };

    const result = await productManager.getProducts(options);
    
    res.render('products', {
      title: 'Productos - Mi Tienda',
      products: result.docs,
      pagination: {
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        limit
      }
    });
  } catch (error) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error al cargar los productos'
    });
  }
});

// GET /products/:pid - Detalle del producto
router.get('/products/:pid', async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid);
    
    if (!product) {
      return res.status(404).render('error', {
        title: 'Error',
        message: 'Producto no encontrado'
      });
    }
    
    res.render('productDetail', {
      title: `${product.title} - Mi Tienda`,
      product
    });
  } catch (error) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error al cargar el producto'
    });
  }
});

// GET /carts/:cid - Vista del carrito
router.get('/carts/:cid', async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    
    if (!cart) {
      return res.status(404).render('error', {
        title: 'Error',
        message: 'Carrito no encontrado'
      });
    }
    
    res.render('cart', {
      title: 'Mi Carrito - Mi Tienda',
      cart,
      cartId: req.params.cid
    });
  } catch (error) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error al cargar el carrito'
    });
  }
});

export default router;
