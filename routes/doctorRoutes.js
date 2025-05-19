import express from 'express';
import { 
  getDoctorProfile, 
  updateDoctorProfile, 
  getAllDoctors,
  getDoctorsBySpecialty
} from '../controllers/doctorController.js';
import { authenticate, isDoctor, isResourceOwner } from '../middlewares/auth.js';
import { validate, updateProfileSchema } from '../middlewares/validation.js';

const router = express.Router();

// Rutas públicas
router.get('/', getAllDoctors);
router.get('/:id', getDoctorProfile);
router.get('/especialidad/:especialidad', getDoctorsBySpecialty);

// Rutas protegidas
router.get('/perfil', authenticate, isDoctor, getDoctorProfile);
router.put('/perfil', authenticate, isDoctor, validate(updateProfileSchema), updateDoctorProfile);

export default router;