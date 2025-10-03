import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/database.js';
import viewsRouter from './routes/views.router.js';
import apiRouter from './routes/api/index.js';
import ProductManager from './ProductManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

const app = express();
const server = createServer(app);
const io = new Server(server);
const PORT = 8080;

app.engine('handlebars', engine({
  helpers: {
    multiply: (a, b) => a * b,
    calculateTotal: (products) => {
      return products.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
      }, 0);
    }
  },
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const productManager = new ProductManager();

app.use('/api', apiRouter);

app.use('/', viewsRouter);

io.on('connection', (socket) => {

  socket.on('addProduct', async (productData) => {
    try {
      const newProduct = await productManager.addProduct(productData);
      const result = await productManager.getProducts();
      io.emit('productsUpdated', result.docs);
      socket.emit('productAdded', newProduct);
    } catch (error) {
      console.error('Error al agregar producto:', error);
      socket.emit('error', 'Error al agregar el producto');
    }
  });

  socket.on('deleteProduct', async (productId) => {
    try {
      const deleted = await productManager.deleteProduct(productId);
      if (deleted) {
        const result = await productManager.getProducts();
        io.emit('productsUpdated', result.docs);
        socket.emit('productDeleted', productId);
      } else {
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
