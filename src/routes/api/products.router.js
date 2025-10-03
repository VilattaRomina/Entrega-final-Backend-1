import { Router } from 'express';
import ProductManager from '../../ProductManager.js';

const router = Router();
const productManager = new ProductManager();

// GET /api/products - Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort,
      query: query ? JSON.parse(query) : undefined
    };

    const result = await productManager.getProducts(options);
    
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    
    res.json({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `${baseUrl}?page=${result.prevPage}&limit=${limit}` : null,
      nextLink: result.hasNextPage ? `${baseUrl}?page=${result.nextPage}&limit=${limit}` : null
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET /api/products/:pid - Obtener un producto por su ID
router.get('/:pid', async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid);
    
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Producto no encontrado'
      });
    }
    
    res.json({
      status: 'success',
      payload: product
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// POST /api/products - Agregar un nuevo producto
router.post('/', async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);
    
    res.status(201).json({
      status: 'success',
      payload: newProduct
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// PUT /api/products/:pid - Actualizar un producto
router.put('/:pid', async (req, res) => {
  try {
    const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
    
    if (!updatedProduct) {
      return res.status(404).json({
        status: 'error',
        message: 'Producto no encontrado'
      });
    }
    
    res.json({
      status: 'success',
      payload: updatedProduct
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// DELETE /api/products/:pid - Eliminar un producto
router.delete('/:pid', async (req, res) => {
  try {
    const result = await productManager.deleteProduct(req.params.pid);
    
    if (!result) {
      return res.status(404).json({
        status: 'error',
        message: 'Producto no encontrado'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Producto eliminado correctamente'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;

