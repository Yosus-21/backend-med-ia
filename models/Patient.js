import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Paciente = sequelize.define('Paciente', {
    id_paciente: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: 'Usuario',
        key: 'id_usuario'
      }
    },
    fecha_nacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    genero: {
      type: DataTypes.ENUM('masculino', 'femenino', 'otro'),
      allowNull: true
    },
    direccion: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'Paciente',
    timestamps: false,
    comment: 'Tabla que almacena información específica de los pacientes'
  });

  return Paciente;
};