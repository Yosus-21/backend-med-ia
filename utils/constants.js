// Estados de citas
export const APPOINTMENT_STATUS = {
  REQUESTED: 'solicitada',
  ACCEPTED: 'aceptada',
  REJECTED: 'rechazada',
  COMPLETED: 'completada',
  CANCELED: 'cancelada'
};

// Tipos de usuario
export const USER_TYPES = {
  PATIENT: 'paciente',
  DOCTOR: 'doctor'
};

// Géneros
export const GENDERS = {
  MALE: 'masculino',
  FEMALE: 'femenino',
  OTHER: 'otro'
};

// Duración predeterminada de citas (en minutos)
export const DEFAULT_APPOINTMENT_DURATION = 30;

// Horario de atención predeterminado
export const DEFAULT_WORKING_HOURS = {
  lunes: ['08:00-12:00', '14:00-18:00'],
  martes: ['08:00-12:00', '14:00-18:00'],
  miércoles: ['08:00-12:00', '14:00-18:00'],
  jueves: ['08:00-12:00', '14:00-18:00'],
  viernes: ['08:00-12:00', '14:00-18:00'],
  sábado: ['09:00-13:00'],
  domingo: []
};

// Especialidades médicas comunes
export const MEDICAL_SPECIALTIES = [
  'Medicina General',
  'Pediatría',
  'Ginecología',
  'Cardiología',
  'Dermatología',
  'Oftalmología',
  'Otorrinolaringología',
  'Traumatología',
  'Neurología',
  'Psiquiatría',
  'Endocrinología',
  'Gastroenterología',
  'Urología',
  'Nefrología',
  'Neumología',
  'Oncología',
  'Hematología',
  'Reumatología',
  'Geriatría',
  'Medicina Interna'
];

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'No estás autorizado para realizar esta acción',
  NOT_FOUND: 'Recurso no encontrado',
  VALIDATION_ERROR: 'Error de validación en los datos proporcionados',
  SERVER_ERROR: 'Error interno del servidor',
  DATABASE_ERROR: 'Error en la base de datos',
  DUPLICATE_EMAIL: 'El correo electrónico ya está registrado',
  INVALID_CREDENTIALS: 'Credenciales inválidas',
  APPOINTMENT_CONFLICT: 'Ya existe una cita programada en ese horario',
  APPOINTMENT_PAST: 'No se pueden programar citas en fechas pasadas',
  DOCTOR_UNAVAILABLE: 'El doctor no está disponible en ese horario'
};

// Mensajes de éxito comunes
export const SUCCESS_MESSAGES = {
  USER_REGISTERED: 'Usuario registrado exitosamente',
  LOGIN_SUCCESS: 'Inicio de sesión exitoso',
  LOGOUT_SUCCESS: 'Sesión cerrada exitosamente',
  PROFILE_UPDATED: 'Perfil actualizado exitosamente',
  PASSWORD_CHANGED: 'Contraseña cambiada exitosamente',
  APPOINTMENT_CREATED: 'Cita creada exitosamente',
  APPOINTMENT_UPDATED: 'Cita actualizada exitosamente',
  APPOINTMENT_CANCELED: 'Cita cancelada exitosamente',
  MEDICAL_HISTORY_UPDATED: 'Historial médico actualizado exitosamente'
};

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

// Tiempo de expiración de tokens (en segundos)
export const TOKEN_EXPIRATION = {
  ACCESS: 24 * 60 * 60, // 24 horas
  REFRESH: 7 * 24 * 60 * 60 // 7 días
};