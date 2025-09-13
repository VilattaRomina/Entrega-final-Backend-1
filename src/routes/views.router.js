import { Router } from 'express';
import ProductManager from '../ProductManager.js';

const router = Router();
const productManager = new ProductManager('./src/data/products.json');

// GET / - Vista home
router.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('home', { 
      title: 'Home - Mi Tienda',
      products 
    });
  } catch (error) {
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Error al cargar los productos' 
    });
  }
});

// GET /realtimeproducts 
router.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { 
      title: 'Productos en Tiempo Real - Mi Tienda',
      products 
    });
  } catch (error) {
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Error al cargar los productos' 
    });
  }
});

export default router;
