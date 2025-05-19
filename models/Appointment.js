import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Cita = sequelize.define('Cita', {
    id_cita: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    id_paciente: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Paciente',
        key: 'id_paciente'
      }
    },
    id_doctor: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Doctor',
        key: 'id_doctor'
      }
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    hora_inicio: {
      type: DataTypes.TIME,
      allowNull: false
    },
    hora_fin: {
      type: DataTypes.TIME,
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM('solicitada', 'aceptada', 'rechazada', 'completada', 'cancelada'),
      defaultValue: 'solicitada'
    },
    motivo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    notas: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'Cita',
    timestamps: false,
    comment: 'Tabla que gestiona las citas entre pacientes y doctores',
    indexes: [
      {
        name: 'idx_fecha',
        fields: ['fecha']
      },
      {
        name: 'idx_estado',
        fields: ['estado']
      }
    ]
  });

  return Cita;
};