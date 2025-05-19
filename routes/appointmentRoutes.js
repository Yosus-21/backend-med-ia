import express from 'express';
import { 
  createAppointment, 
  getAppointmentDetails, 
  updateAppointmentStatus,
  getPatientAppointments,
  getDoctorAppointments
  // cancelAppointment - Esta función no existe en el controlador
} from '../controllers/appointmentController.js';
import { authenticate, isDoctor, isPatient } from '../middlewares/auth.js';
import { validate, appointmentSchema, appointmentStatusSchema } from '../middlewares/validation.js';

const router = express.Router();

// Rutas para pacientes
router.post('/', authenticate, isPatient, validate(appointmentSchema), createAppointment);
router.get('/paciente', authenticate, isPatient, getPatientAppointments);
router.put('/:appointmentId/cancelar', authenticate, isPatient, updateAppointmentStatus);

// Rutas para doctores
router.get('/doctor', authenticate, isDoctor, getDoctorAppointments);
router.put('/:appointmentId/estado', authenticate, isDoctor, validate(appointmentStatusSchema), updateAppointmentStatus);
// router.put('/:appointmentId/notas', authenticate, isDoctor, addAppointmentNotes);

// Rutas comunes
router.get('/:appointmentId', authenticate, getAppointmentDetails);

export default router;