import { v4 as uuidv4 } from 'uuid';
import db from '../models/index.js';

const { Doctor, Usuario } = db;

// Registrar un nuevo doctor
export const registerDoctor = async (req, res) => {
  try {
    const { especialidad, numero_licencia, horario_disponibilidad, userId } = req.body;

    // Verificar si el usuario existe
    const user = await Usuario.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si el usuario ya está registrado como doctor
    const existingDoctor = await Doctor.findOne({ where: { id_doctor: userId } });
    if (existingDoctor) {
      return res.status(400).json({ message: 'El usuario ya está registrado como doctor' });
    }

    // Verificar si el número de licencia ya existe
    const licenseExists = await Doctor.findOne({ where: { numero_licencia } });
    if (licenseExists) {
      return res.status(400).json({ message: 'El número de licencia ya está registrado' });
    }

    // Crear nuevo doctor
    const newDoctor = await Doctor.create({
      id_doctor: userId,
      especialidad,
      numero_licencia,
      horario_disponibilidad: JSON.stringify(horario_disponibilidad || {})
    });

    res.status(201).json({
      message: 'Doctor registrado exitosamente',
      doctor: newDoctor
    });
  } catch (error) {
    console.error('Error al registrar doctor:', error);
    res.status(500).json({ message: 'Error al registrar doctor', error: error.message });
  }
};

// Obtener perfil del doctor
export const getDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.params.id || req.user.id;
    
    const doctor = await Doctor.findByPk(doctorId, {
      include: [
        {
          model: Usuario,
          attributes: ['nombre', 'apellidos', 'email', 'telefono']
        }
      ]
    });
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor no encontrado' });
    }
    
    // Parsear el horario de disponibilidad si existe
    if (doctor.horario_disponibilidad) {
      try {
        doctor.horario_disponibilidad = JSON.parse(doctor.horario_disponibilidad);
      } catch (e) {
        console.error('Error al parsear horario:', e);
      }
    }
    
    res.status(200).json({ doctor });
  } catch (error) {
    console.error('Error al obtener perfil del doctor:', error);
    res.status(500).json({ message: 'Error al obtener perfil del doctor', error: error.message });
  }
};

// Actualizar perfil del doctor
export const updateDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.params.id || req.user.id;
    const { especialidad, horario_disponibilidad } = req.body;
    
    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor no encontrado' });
    }
    
    // Verificar permisos (solo el propio doctor o un admin puede actualizar)
    if (req.user.id !== doctorId && req.user.tipo_usuario !== 'admin') {
      return res.status(403).json({ message: 'No tienes permiso para actualizar este perfil' });
    }
    
    // Actualizar campos
    doctor.especialidad = especialidad || doctor.especialidad;
    
    if (horario_disponibilidad) {
      doctor.horario_disponibilidad = JSON.stringify(horario_disponibilidad);
    }
    
    await doctor.save();
    
    // Parsear el horario de disponibilidad para la respuesta
    let responseDoctor = doctor.get();
    if (responseDoctor.horario_disponibilidad) {
      try {
        responseDoctor.horario_disponibilidad = JSON.parse(responseDoctor.horario_disponibilidad);
      } catch (e) {
        console.error('Error al parsear horario:', e);
      }
    }
    
    res.status(200).json({
      message: 'Perfil de doctor actualizado exitosamente',
      doctor: responseDoctor
    });
  } catch (error) {
    console.error('Error al actualizar perfil del doctor:', error);
    res.status(500).json({ message: 'Error al actualizar perfil del doctor', error: error.message });
  }
};

// Listar todos los doctores
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      include: [
        {
          model: Usuario,
          attributes: ['nombre', 'apellidos', 'email', 'telefono']
        }
      ]
    });
    
    // Parsear el horario de disponibilidad para cada doctor
    const formattedDoctors = doctors.map(doctor => {
      const doctorData = doctor.get();
      if (doctorData.horario_disponibilidad) {
        try {
          doctorData.horario_disponibilidad = JSON.parse(doctorData.horario_disponibilidad);
        } catch (e) {
          console.error('Error al parsear horario:', e);
        }
      }
      return doctorData;
    });
    
    res.status(200).json({ doctors: formattedDoctors });
  } catch (error) {
    console.error('Error al obtener lista de doctores:', error);
    res.status(500).json({ message: 'Error al obtener lista de doctores', error: error.message });
  }
};

// Buscar doctores por especialidad
export const getDoctorsBySpecialty = async (req, res) => {
  try {
    const { especialidad } = req.params;
    
    const doctors = await Doctor.findAll({
      where: { especialidad },
      include: [
        {
          model: Usuario,
          attributes: ['nombre', 'apellidos', 'email', 'telefono']
        }
      ]
    });
    
    // Parsear el horario de disponibilidad para cada doctor
    const formattedDoctors = doctors.map(doctor => {
      const doctorData = doctor.get();
      if (doctorData.horario_disponibilidad) {
        try {
          doctorData.horario_disponibilidad = JSON.parse(doctorData.horario_disponibilidad);
        } catch (e) {
          console.error('Error al parsear horario:', e);
        }
      }
      return doctorData;
    });
    
    res.status(200).json({ doctors: formattedDoctors });
  } catch (error) {
    console.error('Error al buscar doctores por especialidad:', error);
    res.status(500).json({ message: 'Error al buscar doctores por especialidad', error: error.message });
  }
};