import { format, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

// Función para formatear fechas
export const formatDate = (dateString, formatStr = 'dd/MM/yyyy') => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    
    if (!isValid(date)) {
      return 'Fecha inválida';
    }
    
    return format(date, formatStr, { locale: es });
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return 'Fecha inválida';
  }
};

// Función para formatear horas
export const formatTime = (timeString) => {
  try {
    // Si es solo hora (HH:MM), agregar fecha ficticia para poder parsear
    const dateTimeString = timeString.includes('T') 
      ? timeString 
      : `2000-01-01T${timeString}`;
    
    const date = parseISO(dateTimeString);
    
    if (!isValid(date)) {
      return 'Hora inválida';
    }
    
    return format(date, 'HH:mm', { locale: es });
  } catch (error) {
    console.error('Error al formatear hora:', error);
    return 'Hora inválida';
  }
};

// Función para validar disponibilidad de horario
export const isTimeSlotAvailable = (doctorSchedule, date, startTime, endTime) => {
  // Obtener día de la semana (0-6, donde 0 es domingo)
  const dayOfWeek = parseISO(date).getDay();
  const dayNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const dayName = dayNames[dayOfWeek];
  
  // Verificar si el doctor trabaja ese día
  if (!doctorSchedule || !doctorSchedule[dayName] || doctorSchedule[dayName].length === 0) {
    return false;
  }
  
  // Convertir horas a minutos para facilitar comparación
  const startMinutes = convertTimeToMinutes(startTime);
  const endMinutes = convertTimeToMinutes(endTime);
  
  // Verificar si el horario está dentro de alguno de los bloques disponibles del doctor
  return doctorSchedule[dayName].some(timeRange => {
    const [rangeStart, rangeEnd] = timeRange.split('-').map(t => convertTimeToMinutes(t));
    return startMinutes >= rangeStart && endMinutes <= rangeEnd;
  });
};

// Función auxiliar para convertir hora (HH:MM) a minutos
export const convertTimeToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

// Función para generar un mensaje de error formateado
export const formatErrorResponse = (message, errors = null) => {
  return {
    success: false,
    message,
    ...(errors && { errors })
  };
};

// Función para generar un mensaje de éxito formateado
export const formatSuccessResponse = (message, data = null) => {
  return {
    success: true,
    message,
    ...(data && { data })
  };
};

// Función para paginar resultados
export const paginateResults = (items, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const results = {
    total: items.length,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(items.length / limit),
    data: items.slice(startIndex, endIndex)
  };
  
  return results;
};

// Función para sanitizar datos de entrada
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Eliminar caracteres HTML potencialmente peligrosos
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};