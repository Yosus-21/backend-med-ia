import express from 'express';
import { 
  getMedicalHistory, 
  createMedicalHistory, 
  updateMedicalHistory,
  deleteMedicalHistory
} from '../controllers/medicalHistoryController.js';
import { authenticate, isDoctor, isResourceOwner } from '../middlewares/auth.js';
import { validate, medicalHistorySchema } from '../middlewares/validation.js';

const router = express.Router();

// Rutas para pacientes y doctores
router.get('/:patientId', authenticate, isResourceOwner('patientId'), getMedicalHistory);

// Rutas para doctores
router.post('/:patientId', authenticate, isDoctor, validate(medicalHistorySchema), createMedicalHistory);
router.put('/:patientId', authenticate, isDoctor, validate(medicalHistorySchema), updateMedicalHistory);
router.delete('/:patientId', authenticate, isDoctor, deleteMedicalHistory);

export default router;