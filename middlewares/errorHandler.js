// Middleware para manejar errores 404 (recurso no encontrado)
export const notFound = (req, res, next) => {
  const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Middleware para manejar errores generales
export const errorHandler = (err, req, res, next) => {
  // Si el código de estado es 200, cambiarlo a 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Configurar el código de estado de la respuesta
  res.status(statusCode);
  
  // Enviar respuesta JSON con el error
  res.json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    // Solo incluir detalles del error en desarrollo
    ...(process.env.NODE_ENV !== 'production' && { error: err })
  });
};

// Middleware para manejar errores de Sequelize
export const sequelizeErrorHandler = (err, req, res, next) => {
  // Verificar si es un error de Sequelize
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Error de validación en la base de datos',
      errors
    });
  }
  
  // Si no es un error de Sequelize, pasar al siguiente middleware
  next(err);
};