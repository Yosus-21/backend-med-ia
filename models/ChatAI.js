import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ChatIA = sequelize.define('ChatIA', {
    id_chat: {
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
    titulo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'Nueva consulta'
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'ChatIA',
    timestamps: false,
    comment: 'Tabla que almacena las conversaciones de chat con IA'
  });

  return ChatIA;
};