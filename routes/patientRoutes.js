import express from 'express';
import { 
  getPatientProfile, 
  updatePatientProfile, 
  getAllPatients
} from '../controllers/patientController.js';
import { authenticate, isDoctor, isResourceOwner } from '../middlewares/auth.js';
import { validate, updateProfileSchema } from '../middlewares/validation.js';

const router = express.Router();

// Rutas para doctores
router.get('/', authenticate, isDoctor, getAllPatients);
router.get('/:patientId', authenticate, isDoctor, getPatientProfile);

// Rutas para pacientes
router.get('/perfil', authenticate, isResourceOwner('patientId'), getPatientProfile);
router.put('/perfil', authenticate, isResourceOwner('patientId'), validate(updateProfileSchema), updatePatientProfile);

export default router;