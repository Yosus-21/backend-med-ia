import { v4 as uuidv4 } from 'uuid';
import db from '../models/index.js';

const { Paciente, Usuario, HistorialMedico } = db;

// Registrar un nuevo paciente
export const registerPatient = async (req, res) => {
  try {
    const { fecha_nacimiento, genero, direccion, userId } = req.body;

    // Verificar si el usuario existe
    const user = await Usuario.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si el usuario ya está registrado como paciente
    const existingPatient = await Paciente.findOne({ where: { id_paciente: userId } });
    if (existingPatient) {
      return res.status(400).json({ message: 'El usuario ya está registrado como paciente' });
    }

    // Crear nuevo paciente
    const newPatient = await Paciente.create({
      id_paciente: userId,
      fecha_nacimiento,
      genero,
      direccion
    });

    // Crear historial médico vacío para el paciente
    await HistorialMedico.create({
      id_historial: uuidv4(),
      id_paciente: userId,
      alergias: '',
      enfermedades_preexistentes: '',
      medicamentos: ''
    });

    res.status(201).json({
      message: 'Paciente registrado exitosamente',
      patient: newPatient
    });
  } catch (error) {
    console.error('Error al registrar paciente:', error);
    res.status(500).json({ message: 'Error al registrar paciente', error: error.message });
  }
};

// Obtener perfil del paciente
export const getPatientProfile = async (req, res) => {
  try {
    const patientId = req.params.id || req.user.id;
    
    const patient = await Paciente.findByPk(patientId, {
      include: [
        {
          model: Usuario,
          attributes: ['nombre', 'apellidos', 'email', 'telefono']
        },
        {
          model: HistorialMedico
        }
      ]
    });
    
    if (!patient) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }
    
    res.status(200).json({ patient });
  } catch (error) {
    console.error('Error al obtener perfil del paciente:', error);
    res.status(500).json({ message: 'Error al obtener perfil del paciente', error: error.message });
  }
};

// Actualizar perfil del paciente
export const updatePatientProfile = async (req, res) => {
  try {
    const patientId = req.params.id || req.user.id;
    const { fecha_nacimiento, genero, direccion } = req.body;
    
    const patient = await Paciente.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }
    
    // Verificar permisos (solo el propio paciente o un admin puede actualizar)
    if (req.user.id !== patientId && req.user.tipo_usuario !== 'admin') {
      return res.status(403).json({ message: 'No tienes permiso para actualizar este perfil' });
    }
    
    // Actualizar campos
    patient.fecha_nacimiento = fecha_nacimiento || patient.fecha_nacimiento;
    patient.genero = genero || patient.genero;
    patient.direccion = direccion || patient.direccion;
    
    await patient.save();
    
    res.status(200).json({
      message: 'Perfil de paciente actualizado exitosamente',
      patient
    });
  } catch (error) {
    console.error('Error al actualizar perfil del paciente:', error);
    res.status(500).json({ message: 'Error al actualizar perfil del paciente', error: error.message });
  }
};

// Listar todos los pacientes (solo para doctores)
export const getAllPatients = async (req, res) => {
  try {
    // Verificar si el usuario es doctor
    if (req.user.tipo_usuario !== 'doctor') {
      return res.status(403).json({ message: 'Acceso denegado. Solo los doctores pueden ver la lista de pacientes' });
    }
    
    const patients = await Paciente.findAll({
      include: [
        {
          model: Usuario,
          attributes: ['nombre', 'apellidos', 'email', 'telefono']
        }
      ]
    });
    
    res.status(200).json({ patients });
  } catch (error) {
    console.error('Error al obtener lista de pacientes:', error);
    res.status(500).json({ message: 'Error al obtener lista de pacientes', error: error.message });
  }
};

// Obtener pacientes de un doctor específico
export const getDoctorPatients = async (req, res) => {
  try {
    const doctorId = req.user.id;
    
    // Verificar si el usuario es doctor
    if (req.user.tipo_usuario !== 'doctor') {
      return res.status(403).json({ message: 'Acceso denegado. Solo los doctores pueden ver sus pacientes' });
    }
    
    // Obtener pacientes que han tenido citas con este doctor
    const patients = await Paciente.findAll({
      include: [
        {
          model: Usuario,
          attributes: ['nombre', 'apellidos', 'email', 'telefono']
        },
        {
          model: db.Cita,
          where: { id_doctor: doctorId },
          required: true
        }
      ]
    });
    
    res.status(200).json({ patients });
  } catch (error) {
    console.error('Error al obtener pacientes del doctor:', error);
    res.status(500).json({ message: 'Error al obtener pacientes del doctor', error: error.message });
  }
};