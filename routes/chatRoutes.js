import express from 'express';
import { 
  createChat, 
  getChatById, 
  getAllPatientChats,
  sendMessage,
  updateChatTitle,
  deleteChat
} from '../controllers/chatController.js';
import { authenticate, isPatient, isResourceOwner } from '../middlewares/auth.js';
import { validate, chatMessageSchema } from '../middlewares/validation.js';

const router = express.Router();

// Todas las rutas requieren autenticación y ser paciente
router.use(authenticate);
router.use(isPatient);

// Rutas de chat
router.post('/', createChat);
router.get('/', getAllPatientChats);
router.get('/:chatId', getChatById);
router.post('/:chatId/mensaje', validate(chatMessageSchema), sendMessage);
router.put('/:chatId/titulo', updateChatTitle);
router.delete('/:chatId', deleteChat);

export default router;