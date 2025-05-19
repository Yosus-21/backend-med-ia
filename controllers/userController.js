import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { generateToken, COOKIE_OPTIONS } from '../config/auth.js';
import db from '../models/index.js';

const { Usuario } = db;

// Registrar un nuevo usuario
export const register = async (req, res) => {
  try {
    const { nombre, apellidos, email, contrasena, telefono, tipo_usuario } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await Usuario.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Crear nuevo usuario
    const newUser = await Usuario.create({
      id_usuario: uuidv4(),
      nombre,
      apellidos,
      email,
      contrasena: hashedPassword,
      telefono,
      tipo_usuario
    });

    // Generar token JWT
    const token = generateToken({
      id: newUser.id_usuario,
      email: newUser.email,
      tipo_usuario: newUser.tipo_usuario
    });

    // Establecer cookie con el token
    res.cookie('token', token, COOKIE_OPTIONS);

    // Responder sin incluir la contraseña
    const userWithoutPassword = { ...newUser.get() };
    delete userWithoutPassword.contrasena;

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
  }
};

// Iniciar sesión
export const login = async (req, res) => {
  try {
    const { email, contrasena } = req.body;

    // Buscar usuario por email
    const user = await Usuario.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = generateToken({
      id: user.id_usuario,
      email: user.email,
      tipo_usuario: user.tipo_usuario
    });

    // Establecer cookie con el token
    res.cookie('token', token, COOKIE_OPTIONS);

    // Responder sin incluir la contraseña
    const userWithoutPassword = { ...user.get() };
    delete userWithoutPassword.contrasena;

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};

// Cerrar sesión
export const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Sesión cerrada exitosamente' });
};

// Obtener perfil del usuario actual
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await Usuario.findByPk(userId, {
      attributes: { exclude: ['contrasena'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ message: 'Error al obtener perfil', error: error.message });
  }
};

// Actualizar perfil de usuario
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { nombre, apellidos, telefono } = req.body;
    
    const user = await Usuario.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Actualizar campos
    user.nombre = nombre || user.nombre;
    user.apellidos = apellidos || user.apellidos;
    user.telefono = telefono || user.telefono;
    
    await user.save();
    
    // Responder sin incluir la contraseña
    const userWithoutPassword = { ...user.get() };
    delete userWithoutPassword.contrasena;
    
    res.status(200).json({
      message: 'Perfil actualizado exitosamente',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ message: 'Error al actualizar perfil', error: error.message });
  }
};

// Cambiar contraseña
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    const user = await Usuario.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Verificar contraseña actual
    const isPasswordValid = await bcrypt.compare(currentPassword, user.contrasena);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña actual incorrecta' });
    }
    
    // Encriptar nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.contrasena = hashedPassword;
    
    await user.save();
    
    res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ message: 'Error al cambiar contraseña', error: error.message });
  }
};