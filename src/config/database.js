import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  try {
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };
    
    await mongoose.connect(process.env.MONGODB_URI, options);
    
    mongoose.connection.on('error', (err) => {
      console.error('Error de conexión MongoDB:', err.message);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB desconectado');
    });
    
  } catch (error) {
    console.error('Error al conectar a MongoDB Atlas:', error.message);
  
    process.exit(1);
  }
};