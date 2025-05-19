import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Clave secreta para firmar los tokens JWT
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura';

// Tiempo de expiración del token (en segundos)
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Opciones para las cookies
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000, // 24 horas en milisegundos
};

// Función para generar un token JWT
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Función para verificar un token JWT
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export { JWT_SECRET, JWT_EXPIRES_IN, COOKIE_OPTIONS, generateToken, verifyToken };