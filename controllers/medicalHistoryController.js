import db from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

const { HistorialMedico } = db;

// Obtener el historial médico de un paciente específico
export const getMedicalHistory = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Verificar que el usuario solicitante sea el paciente o un doctor autorizado
    if (req.user.id !== patientId && req.user.tipo_usuario !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para acceder a este historial médico'
      });
    }

    const medicalHistory = await HistorialMedico.findOne({
      where: { id_paciente: patientId }
    });

    if (!medicalHistory) {
      return res.status(404).json({
        success: false,
        message: 'Historial médico no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: medicalHistory
    });
  } catch (error) {
    console.error('Error al obtener historial médico:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el historial médico',
      error: error.message
    });
  }
};

// Crear un nuevo historial médico para un paciente
export const createMedicalHistory = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { alergias, enfermedades_preexistentes, medicamentos } = req.body;

    // Verificar si ya existe un historial para este paciente
    const existingHistory = await MedicalHistory.findOne({
      where: { id_paciente: patientId }
    });

    if (existingHistory) {
      return res.status(400).json({
        success: false,
        message: 'El paciente ya tiene un historial médico'
      });
    }

    // Crear nuevo historial médico
    const newMedicalHistory = await MedicalHistory.create({
      id_historial: uuidv4(),
      id_paciente: patientId,
      alergias: alergias || '',
      enfermedades_preexistentes: enfermedades_preexistentes || '',
      medicamentos: medicamentos || ''
    });

    res.status(201).json({
      success: true,
      message: 'Historial médico creado exitosamente',
      data: newMedicalHistory
    });
  } catch (error) {
    console.error('Error al crear historial médico:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el historial médico',
      error: error.message
    });
  }
};

// Actualizar el historial médico de un paciente
export const updateMedicalHistory = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { alergias, enfermedades_preexistentes, medicamentos } = req.body;

    // Verificar que el usuario solicitante sea el paciente o un doctor
    if (req.user.id !== patientId && req.user.tipo_usuario !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para actualizar este historial médico'
      });
    }

    // Buscar el historial médico existente
    const medicalHistory = await MedicalHistory.findOne({
      where: { id_paciente: patientId }
    });

    if (!medicalHistory) {
      return res.status(404).json({
        success: false,
        message: 'Historial médico no encontrado'
      });
    }

    // Actualizar los campos del historial médico
    const updatedHistory = await medicalHistory.update({
      alergias: alergias !== undefined ? alergias : medicalHistory.alergias,
      enfermedades_preexistentes: enfermedades_preexistentes !== undefined ? enfermedades_preexistentes : medicalHistory.enfermedades_preexistentes,
      medicamentos: medicamentos !== undefined ? medicamentos : medicalHistory.medicamentos
    });

    res.status(200).json({
      success: true,
      message: 'Historial médico actualizado exitosamente',
      data: updatedHistory
    });
  } catch (error) {
    console.error('Error al actualizar historial médico:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el historial médico',
      error: error.message
    });
  }
};

// Eliminar el historial médico de un paciente (solo para administradores)
export const deleteMedicalHistory = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Verificar que el usuario sea un administrador o doctor autorizado
    if (req.user.tipo_usuario !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar historiales médicos'
      });
    }

    // Buscar el historial médico
    const medicalHistory = await MedicalHistory.findOne({
      where: { id_paciente: patientId }
    });

    if (!medicalHistory) {
      return res.status(404).json({
        success: false,
        message: 'Historial médico no encontrado'
      });
    }

    // Eliminar el historial médico
    await medicalHistory.destroy();

    res.status(200).json({
      success: true,
      message: 'Historial médico eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar historial médico:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el historial médico',
      error: error.message
    });
  }
};