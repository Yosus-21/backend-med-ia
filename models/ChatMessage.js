import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const MensajeChat = sequelize.define('MensajeChat', {
    id_mensaje: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    id_chat: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'ChatIA',
        key: 'id_chat'
      }
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    es_ia: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      comment: 'TRUE si es respuesta de la IA, FALSE si es del usuario'
    },
    fecha_hora: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'MensajeChat',
    timestamps: false,
    comment: 'Tabla que almacena los mensajes individuales de las conversaciones con el chatbot'
  });

  return MensajeChat;
};