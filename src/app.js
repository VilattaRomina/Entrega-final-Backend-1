import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import viewsRouter from './routes/views.router.js';
import ProductManager from './ProductManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);
const PORT = 8080;

// Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Instancia del ProductManager
const productManager = new ProductManager('./src/data/products.json');

// Rutas de vistas
app.use('/', viewsRouter);

// Socket.io
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('addProduct', async (productData) => {
    console.log('Recibido addProduct:', productData);
    try {
      const newProduct = await productManager.addProduct(productData);
      console.log('Producto agregado:', newProduct);
      const products = await productManager.getProducts();
      console.log('Enviando productsUpdated a todos los clientes:', products.length, 'productos');
      io.emit('productsUpdated', products);
      socket.emit('productAdded', newProduct);
    } catch (error) {
      console.error('Error al agregar producto:', error);
      socket.emit('error', 'Error al agregar el producto');
    }
  });

  socket.on('deleteProduct', async (productId) => {
    console.log('Recibido deleteProduct:', productId);
    try {
      const result = await productManager.deleteProduct(productId);
      if (result) {
        console.log('Producto eliminado exitosamente');
        const products = await productManager.getProducts();
        console.log('Enviando productsUpdated a todos los clientes:', products.length, 'productos');
        io.emit('productsUpdated', products);
        socket.emit('productDeleted', productId);
      } else {
        console.log('Producto no encontrado');
        socket.emit('error', 'Producto no encontrado');
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      socket.emit('error', 'Error al eliminar el producto');
    }
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
