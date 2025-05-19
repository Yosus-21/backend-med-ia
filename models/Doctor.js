import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Doctor = sequelize.define('Doctor', {
    id_doctor: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: 'Usuario',
        key: 'id_usuario'
      }
    },
    especialidad: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    numero_licencia: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    horario_disponibilidad: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    tableName: 'Doctor',
    timestamps: false,
    comment: 'Tabla que almacena información específica de los doctores'
  });

  return Doctor;
};