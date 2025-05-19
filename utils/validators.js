import { z } from 'zod';

// Esquemas de validación para usuarios
export const userSchemas = {
  // Esquema para registro de usuario
  register: z.object({
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    apellidos: z.string().min(2, 'Los apellidos deben tener al menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    contrasena: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    telefono: z.string().optional(),
    tipo_usuario: z.enum(['paciente', 'doctor'], {
      errorMap: () => ({ message: 'El tipo de usuario debe ser paciente o doctor' })
    })
  }),

  // Esquema para inicio de sesión
  login: z.object({
    email: z.string().email('Email inválido'),
    contrasena: z.string().min(1, 'La contraseña es requerida')
  }),

  // Esquema para actualización de perfil
  updateProfile: z.object({
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
    apellidos: z.string().min(2, 'Los apellidos deben tener al menos 2 caracteres').optional(),
    telefono: z.string().optional()
  }),

  // Esquema para cambio de contraseña
  changePassword: z.object({
    currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
    newPassword: z.string().min(6, 'La nueva contraseña debe tener al menos 6 caracteres')
  })
};

// Esquemas de validación para pacientes
export const patientSchemas = {
  // Esquema para actualización de perfil de paciente
  updateProfile: z.object({
    fecha_nacimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)').optional(),
    genero: z.enum(['masculino', 'femenino', 'otro'], {
      errorMap: () => ({ message: 'El género debe ser masculino, femenino u otro' })
    }).optional(),
    direccion: z.string().optional()
  })
};

// Esquemas de validación para doctores
export const doctorSchemas = {
  // Esquema para actualización de perfil de doctor
  updateProfile: z.object({
    especialidad: z.string().min(3, 'La especialidad debe tener al menos 3 caracteres').optional(),
    numero_licencia: z.string().min(5, 'El número de licencia debe tener al menos 5 caracteres').optional(),
    horario_disponibilidad: z.record(z.array(z.string())).optional()
  })
};

// Esquemas de validación para historial médico
export const medicalHistorySchemas = {
  // Esquema para creación/actualización de historial médico
  update: z.object({
    alergias: z.string().optional(),
    enfermedades_preexistentes: z.string().optional(),
    medicamentos: z.string().optional()
  })
};

// Esquemas de validación para citas
export const appointmentSchemas = {
  // Esquema para creación de cita
  create: z.object({
    id_doctor: z.string().uuid('ID de doctor inválido'),
    fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
    hora_inicio: z.string().regex(/^\d{2}:\d{2}$/, 'Formato de hora inválido (HH:MM)'),
    hora_fin: z.string().regex(/^\d{2}:\d{2}$/, 'Formato de hora inválido (HH:MM)'),
    motivo: z.string().min(5, 'El motivo debe tener al menos 5 caracteres')
  }),

  // Esquema para actualización de estado de cita
  updateStatus: z.object({
    estado: z.enum(['solicitada', 'aceptada', 'rechazada', 'completada', 'cancelada'], {
      errorMap: () => ({ message: 'Estado de cita inválido' })
    })
  }),

  // Esquema para agregar notas a una cita
  addNotes: z.object({
    notas: z.string().min(5, 'Las notas deben tener al menos 5 caracteres')
  })
};

// Esquemas de validación para chat
export const chatSchemas = {
  // Esquema para mensaje de chat
  message: z.object({
    mensaje: z.string().min(1, 'El mensaje no puede estar vacío')
  }),

  // Esquema para actualización de título de chat
  updateTitle: z.object({
    titulo: z.string().min(3, 'El título debe tener al menos 3 caracteres')
  })
};