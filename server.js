import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';
import { syncDatabase } from './models/index.js';
import routes from './routes/index.js';
import { Server } from 'socket.io';
import http from 'http';

// Cargar variables de entorno
dotenv.config();

// Crear la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Crear servidor HTTP
const server = http.createServer(app);

// Configurar Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_URL 
      : 'http://localhost:5173',
    credentials: true
  }
});

// Manejar eventos de WebSocket
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  // Unirse a sala de usuario
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
  });

  // Manejar eventos de citas
  socket.on('appointment-update', (data) => {
    io.to(`user-${data.patientId}`).emit('appointment-notification', data);
    io.to(`user-${data.doctorId}`).emit('appointment-notification', data);
  });

  // Manejar eventos de chat
  socket.on('chat-message', (data) => {
    io.to(`chat-${data.chatId}`).emit('new-message', data);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Middlewares
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Aplicar rutas
app.use(routes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API de la aplicación de salud con chatbot de IA' });
});

// Modificar el inicio del servidor
const startServer = async () => {
  try {
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('No se pudo conectar a la base de datos. Verificar configuración.');
      process.exit(1);
    }
    
    await syncDatabase();
    
    // Iniciar el servidor HTTP con Socket.IO
    server.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();