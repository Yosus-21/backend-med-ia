import express from 'express';
import userRoutes from './userRoutes.js';
import patientRoutes from './patientRoutes.js';
import doctorRoutes from './doctorRoutes.js';
import appointmentRoutes from './appointmentRoutes.js';
import chatRoutes from './chatRoutes.js';
import medicalHistoryRoutes from './medicalHistoryRoutes.js';
import { notFound, errorHandler, sequelizeErrorHandler } from '../middlewares/errorHandler.js';

const router = express.Router();

// Rutas principales
router.use('/api/usuarios', userRoutes);
router.use('/api/pacientes', patientRoutes);
router.use('/api/doctores', doctorRoutes);
router.use('/api/citas', appointmentRoutes);
router.use('/api/chat', chatRoutes);
router.use('/api/historial-medico', medicalHistoryRoutes);

// Middleware para manejar rutas no encontradas
router.use(notFound);

// Middleware para manejar errores de Sequelize
router.use(sequelizeErrorHandler);

// Middleware para manejar errores generales
router.use(errorHandler);

export default router;