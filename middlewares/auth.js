import { verifyToken } from '../config/auth.js';

// Middleware para verificar autenticación
export const authenticate = (req, res, next) => {
  try {
    // Obtener token de las cookies o del header de autorización
    const token = req.cookies.token || 
                 (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Acceso no autorizado. Por favor inicia sesión.'
      });
    }

    // Verificar token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado. Por favor inicia sesión nuevamente.'
      });
    }

    // Agregar información del usuario al objeto request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      tipo_usuario: decoded.tipo_usuario
    };

    next();
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    res.status(500).json({
      success: false,
      message: 'Error en la autenticación',
      error: error.message
    });
  }
};

// Middleware para verificar rol de doctor
export const isDoctor = (req, res, next) => {
  if (req.user && req.user.tipo_usuario === 'doctor') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requiere rol de doctor.'
    });
  }
};

// Middleware para verificar rol de paciente
export const isPatient = (req, res, next) => {
  if (req.user && req.user.tipo_usuario === 'paciente') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requiere rol de paciente.'
    });
  }
};

// Middleware para verificar que el usuario es el propietario del recurso
export const isResourceOwner = (paramName) => {
  return (req, res, next) => {
    const resourceId = req.params[paramName];
    
    if (req.user.id === resourceId || req.user.tipo_usuario === 'doctor') {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: 'Acceso denegado. No tienes permiso para acceder a este recurso.'
      });
    }
  };
};