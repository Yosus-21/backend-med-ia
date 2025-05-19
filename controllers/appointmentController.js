import { v4 as uuidv4 } from 'uuid';
import db from '../models/index.js';

const { Cita, Paciente, Doctor, Usuario } = db;

// Crear una nueva cita
export const createAppointment = async (req, res) => {
  try {
    const { id_doctor, fecha, hora_inicio, hora_fin, motivo } = req.body;
    const id_paciente = req.user.id;

    // Verificar si el paciente existe
    const patient = await Paciente.findByPk(id_paciente);
    if (!patient) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }

    // Verificar si el doctor existe
    const doctor = await Doctor.findByPk(id_doctor);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor no encontrado' });
    }

    // Verificar disponibilidad del doctor
    const existingAppointment = await Cita.findOne({
      where: {
        id_doctor,
        fecha,
        hora_inicio,
        estado: ['solicitada', 'aceptada']
      }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'El doctor ya tiene una cita programada en ese horario' });
    }

    // Crear nueva cita
    const newAppointment = await Cita.create({
      id_cita: uuidv4(),
      id_paciente,
      id_doctor,
      fecha,
      hora_inicio,
      hora_fin,
      motivo,
      estado: 'solicitada',
      notas: ''
    });

    res.status(201).json({
      message: 'Cita creada exitosamente',
      appointment: newAppointment
    });
  } catch (error) {
    console.error('Error al crear cita:', error);
    res.status(500).json({ message: 'Error al crear cita', error: error.message });
  }
};

// Obtener todas las citas de un paciente
export const getPatientAppointments = async (req, res) => {
  try {
    const id_paciente = req.user.id;
    
    const appointments = await Cita.findAll({
      where: { id_paciente },
      include: [
        {
          model: Doctor,
          include: [
            {
              model: Usuario,
              attributes: ['nombre', 'apellidos']
            }
          ]
        }
      ],
      order: [['fecha', 'DESC'], ['hora_inicio', 'ASC']]
    });
    
    res.status(200).json({ appointments });
  } catch (error) {
    console.error('Error al obtener citas del paciente:', error);
    res.status(500).json({ message: 'Error al obtener citas del paciente', error: error.message });
  }
};

// Obtener todas las citas de un doctor
export const getDoctorAppointments = async (req, res) => {
  try {
    const id_doctor = req.user.id;
    
    const appointments = await Cita.findAll({
      where: { id_doctor },
      include: [
        {
          model: Paciente,
          include: [
            {
              model: Usuario,
              attributes: ['nombre', 'apellidos']
            }
          ]
        }
      ],
      order: [['fecha', 'DESC'], ['hora_inicio', 'ASC']]
    });
    
    res.status(200).json({ appointments });
  } catch (error) {
    console.error('Error al obtener citas del doctor:', error);
    res.status(500).json({ message: 'Error al obtener citas del doctor', error: error.message });
  }
};

// Actualizar estado de una cita (aceptar, rechazar, completar)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, notas } = req.body;
    const userId = req.user.id;
    
    const appointment = await Cita.findByPk(id, {
      include: [
        {
          model: Paciente,
          include: [{ model: Usuario, attributes: ['nombre', 'apellidos'] }]
        },
        {
          model: Doctor,
          include: [{ model: Usuario, attributes: ['nombre', 'apellidos'] }]
        }
      ]
    });
    if (!appointment) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }
    
    // Verificar permisos (solo el doctor asignado puede actualizar el estado)
    if (req.user.tipo_usuario === 'doctor' && appointment.id_doctor !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para actualizar esta cita' });
    }
    
    // Verificar permisos (solo el paciente puede cancelar su propia cita)
    if (req.user.tipo_usuario === 'paciente' && appointment.id_paciente !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para actualizar esta cita' });
    }
    
    // Pacientes solo pueden cancelar citas
    if (req.user.tipo_usuario === 'paciente' && estado !== 'cancelada') {
      return res.status(403).json({ message: 'Los pacientes solo pueden cancelar citas' });
    }
    
    // Actualizar estado
    appointment.estado = estado;
    
    // Actualizar notas si se proporcionan (solo doctores)
    if (notas && req.user.tipo_usuario === 'doctor') {
      appointment.notas = notas;
    }
    
    await appointment.save();
    
    // Emitir evento WebSocket
    req.app.get('io').emit('appointment-update', {
      appointmentId: id,
      patientId: appointment.id_paciente,
      doctorId: appointment.id_doctor,
      status: estado,
      message: `La cita ha sido ${estado}`
    });
    
    res.status(200).json({
      message: 'Estado de cita actualizado exitosamente',
      appointment
    });
  } catch (error) {
    console.error('Error al actualizar estado de cita:', error);
    res.status(500).json({ message: 'Error al actualizar estado de cita', error: error.message });
  }
};

// Obtener detalles de una cita específica
export const getAppointmentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const appointment = await Cita.findByPk(id, {
      include: [
        {
          model: Paciente,
          include: [
            {
              model: Usuario,
              attributes: ['nombre', 'apellidos', 'email', 'telefono']
            }
          ]
        },
        {
          model: Doctor,
          include: [
            {
              model: Usuario,
              attributes: ['nombre', 'apellidos', 'email', 'telefono']
            }
          ]
        }
      ]
    });
    
    if (!appointment) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }
    
    // Verificar permisos (solo el doctor asignado o el paciente pueden ver los detalles)
    if (appointment.id_doctor !== userId && appointment.id_paciente !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para ver esta cita' });
    }
    
    res.status(200).json({ appointment });
  } catch (error) {
    console.error('Error al obtener detalles de cita:', error);
    res.status(500).json({ message: 'Error al obtener detalles de cita', error: error.message });
  }
};