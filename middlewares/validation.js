import { z } from 'zod';

// Middleware genérico de validación
export const validate = (schema) => (req, res, next) => {
  try {
    // Validar el cuerpo de la solicitud con el esquema proporcionado
    schema.parse(req.body);
    next();
  } catch (error) {
    // Si hay errores de validación, enviar respuesta con los errores
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      });
    }
    
    // Si es otro tipo de error, pasar al siguiente middleware de error
    next(error);
  }
};

// Esquemas de validación para diferentes entidades

// Esquema para registro de usuario
export const registerSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellidos: z.string().min(2, 'Los apellidos deben tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  contrasena: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  telefono: z.string().optional(),
  tipo_usuario: z.enum(['paciente', 'doctor'], {
    errorMap: () => ({ message: 'El tipo de usuario debe ser paciente o doctor' })
  })
});

// Esquema para inicio de sesión
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  contrasena: z.string().min(1, 'La contraseña es requerida')
});

// Esquema para actualización de perfil
export const updateProfileSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  apellidos: z.string().min(2, 'Los apellidos deben tener al menos 2 caracteres').optional(),
  telefono: z.string().optional()
});

// Esquema para cambio de contraseña
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
  newPassword: z.string().min(6, 'La nueva contraseña debe tener al menos 6 caracteres')
});

// Esquema para creación/actualización de historial médico
export const medicalHistorySchema = z.object({
  alergias: z.string().optional(),
  enfermedades_preexistentes: z.string().optional(),
  medicamentos: z.string().optional()
});

// Esquema para creación de cita
export const appointmentSchema = z.object({
  id_doctor: z.string().uuid('ID de doctor inválido'),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
  hora_inicio: z.string().regex(/^\d{2}:\d{2}$/, 'Formato de hora inválido (HH:MM)'),
  hora_fin: z.string().regex(/^\d{2}:\d{2}$/, 'Formato de hora inválido (HH:MM)'),
  motivo: z.string().min(5, 'El motivo debe tener al menos 5 caracteres')
});

// Esquema para actualización de estado de cita
export const appointmentStatusSchema = z.object({
  estado: z.enum(['solicitada', 'aceptada', 'rechazada', 'completada', 'cancelada'], {
    errorMap: () => ({ message: 'Estado de cita inválido' })
  })
});

// Esquema para mensaje de chat
export const chatMessageSchema = z.object({
  mensaje: z.string().min(1, 'El mensaje no puede estar vacío')
});