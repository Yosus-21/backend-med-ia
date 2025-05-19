import { sequelize } from '../config/database.js';
import UserModel from './User.js';
import PatientModel from './Patient.js';
import DoctorModel from './Doctor.js';
import MedicalHistoryModel from './MedicalHistory.js';
import AppointmentModel from './Appointment.js';
import ChatAIModel from './ChatAI.js';
import ChatMessageModel from './ChatMessage.js';

// Inicializar modelos
const Usuario = UserModel(sequelize);
const Paciente = PatientModel(sequelize);
const Doctor = DoctorModel(sequelize);
const HistorialMedico = MedicalHistoryModel(sequelize);
const Cita = AppointmentModel(sequelize);
const ChatIA = ChatAIModel(sequelize);
const MensajeChat = ChatMessageModel(sequelize);

// Definir asociaciones

// Relación Usuario-Paciente (herencia)
Usuario.hasOne(Paciente, {
  foreignKey: 'id_paciente',
  as: 'paciente'
});
Paciente.belongsTo(Usuario, {
  foreignKey: 'id_paciente',
  as: 'usuario'
});

// Relación Usuario-Doctor (herencia)
Usuario.hasOne(Doctor, {
  foreignKey: 'id_doctor',
  as: 'doctor'
});
Doctor.belongsTo(Usuario, {
  foreignKey: 'id_doctor',
  as: 'usuario'
});

// Relación Paciente-HistorialMedico (1:1)
Paciente.hasOne(HistorialMedico, {
  foreignKey: 'id_paciente',
  as: 'historialMedico'
});
HistorialMedico.belongsTo(Paciente, {
  foreignKey: 'id_paciente',
  as: 'paciente'
});

// Relación Paciente-Cita (1:N)
Paciente.hasMany(Cita, {
  foreignKey: 'id_paciente',
  as: 'citas'
});
Cita.belongsTo(Paciente, {
  foreignKey: 'id_paciente',
  as: 'paciente'
});

// Relación Doctor-Cita (1:N)
Doctor.hasMany(Cita, {
  foreignKey: 'id_doctor',
  as: 'citas'
});
Cita.belongsTo(Doctor, {
  foreignKey: 'id_doctor',
  as: 'doctor'
});

// Relación Paciente-ChatIA (1:N)
Paciente.hasMany(ChatIA, {
  foreignKey: 'id_paciente',
  as: 'chats'
});
ChatIA.belongsTo(Paciente, {
  foreignKey: 'id_paciente',
  as: 'paciente'
});

// Relación ChatIA-MensajeChat (1:N)
ChatIA.hasMany(MensajeChat, {
  foreignKey: 'id_chat',
  as: 'mensajes'
});
MensajeChat.belongsTo(ChatIA, {
  foreignKey: 'id_chat',
  as: 'chat'
});

// Sincronizar modelos con la base de datos
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Base de datos sincronizada correctamente');
  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error);
  }
};

// Exportar modelos y función de sincronización
export {
  sequelize,
  Usuario,
  Paciente,
  Doctor,
  HistorialMedico,
  Cita,
  ChatIA,
  MensajeChat,
  syncDatabase
};

export default {
  sequelize,
  Usuario,
  Paciente,
  Doctor,
  HistorialMedico,
  Cita,
  ChatIA,
  MensajeChat
};