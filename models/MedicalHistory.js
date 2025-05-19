import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const HistorialMedico = sequelize.define('HistorialMedico', {
    id_historial: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    id_paciente: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'Paciente',
        key: 'id_paciente'
      }
    },
    alergias: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    enfermedades_preexistentes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    medicamentos: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ultima_actualizacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'HistorialMedico',
    timestamps: false,
    comment: 'Tabla que almacena el historial médico de cada paciente'
  });

  return HistorialMedico;
};