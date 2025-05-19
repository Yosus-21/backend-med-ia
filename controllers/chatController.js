import { v4 as uuidv4 } from 'uuid';
import db from '../models/index.js';

const { ChatIA, MensajeChat, Usuario } = db;

// Crear un nuevo chat
export const createChat = async (req, res) => {
  try {
    const id_paciente = req.user.id;
    const { titulo } = req.body;

    // Verificar si el usuario existe como paciente
    const pacienteExistente = await db.Paciente.findByPk(id_paciente);
    
    // Si no existe, crearlo
    if (!pacienteExistente) {
      await db.Paciente.create({
        id_paciente,
        fecha_nacimiento: null,
        genero: null,
        direccion: null
      });
      
      // Crear historial médico vacío para el paciente
      await db.HistorialMedico.create({
        id_historial: uuidv4(),
        id_paciente,
        alergias: '',
        enfermedades_preexistentes: '',
        medicamentos: ''
      });
    }

    // Crear nuevo chat
    const newChat = await ChatIA.create({
      id_chat: uuidv4(),
      id_paciente,
      titulo: titulo || 'Nueva consulta',
      fecha_creacion: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Chat creado exitosamente',
      data: newChat
    });
  } catch (error) {
    console.error('Error al crear chat:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el chat',
      error: error.message
    });
  }
};

// Obtener un chat específico por ID
export const getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await ChatIA.findByPk(chatId, {
      include: [
        {
          model: MensajeChat,
          as: 'mensajes',
          order: [['fecha_envio', 'ASC']]
        }
      ]
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat no encontrado'
      });
    }

    // Verificar que el chat pertenezca al usuario
    if (chat.id_paciente !== userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para acceder a este chat'
      });
    }

    res.status(200).json({
      success: true,
      data: chat
    });
  } catch (error) {
    console.error('Error al obtener chat:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el chat',
      error: error.message
    });
  }
};

// Obtener todos los chats de un paciente
export const getAllPatientChats = async (req, res) => {
  try {
    const id_paciente = req.user.id;

    const chats = await ChatIA.findAll({
      where: { id_paciente },
      order: [['fecha_creacion', 'DESC']],
      include: [
        {
          model: MensajeChat,
          as: 'mensajes',
          limit: 1,
          order: [['fecha_envio', 'DESC']]
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: chats
    });
  } catch (error) {
    console.error('Error al obtener chats del paciente:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los chats',
      error: error.message
    });
  }
};

// Enviar un mensaje en un chat
export const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { mensaje } = req.body;
    const userId = req.user.id;

    // Verificar que el chat exista
    const chat = await ChatIA.findByPk(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat no encontrado'
      });
    }

    // Verificar que el chat pertenezca al usuario
    if (chat.id_paciente !== userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para enviar mensajes en este chat'
      });
    }

    // Crear nuevo mensaje del usuario
    const userMessage = await MensajeChat.create({
      id_mensaje: uuidv4(),
      id_chat: chatId,
      contenido: mensaje,
      es_ia: false,
      fecha_envio: new Date()
    });

    try {
      // Generar respuesta de la IA usando LM Studio
      const iaResponse = await generateChatResponse([
        { role: 'user', content: mensaje }
      ]);

      // Guardar respuesta de la IA
      const iaMessage = await MensajeChat.create({
        id_mensaje: uuidv4(),
        id_chat: chatId,
        contenido: iaResponse,
        es_ia: true,
        fecha_envio: new Date()
      });

      res.status(201).json({
        success: true,
        message: 'Mensajes enviados exitosamente',
        data: {
          userMessage,
          iaMessage
        }
      });
    } catch (iaError) {
      // Si hay error con la IA, al menos guardamos el mensaje del usuario
      console.error('Error al generar respuesta de IA:', iaError);
      res.status(201).json({
        success: true,
        message: 'Mensaje enviado pero hubo un error al generar respuesta de IA',
        data: {
          userMessage
        },
        error: 'Error al conectar con el servicio de IA'
      });
    }
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    res.status(500).json({
      success: false,
      message: 'Error al enviar el mensaje',
      error: error.message
    });
  }
};

// Actualizar el título de un chat
export const updateChatTitle = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { titulo } = req.body;
    const userId = req.user.id;

    // Verificar que el chat exista
    const chat = await ChatIA.findByPk(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat no encontrado'
      });
    }

    // Verificar que el chat pertenezca al usuario
    if (chat.id_paciente !== userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para actualizar este chat'
      });
    }

    // Actualizar título
    chat.titulo = titulo;
    await chat.save();

    res.status(200).json({
      success: true,
      message: 'Título de chat actualizado exitosamente',
      data: chat
    });
  } catch (error) {
    console.error('Error al actualizar título de chat:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el título del chat',
      error: error.message
    });
  }
};

// Eliminar un chat
export const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    // Verificar que el chat exista
    const chat = await ChatIA.findByPk(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat no encontrado'
      });
    }

    // Verificar que el chat pertenezca al usuario
    if (chat.id_paciente !== userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar este chat'
      });
    }

    // Eliminar mensajes asociados al chat
    await MensajeChat.destroy({
      where: { id_chat: chatId }
    });

    // Eliminar el chat
    await chat.destroy();

    res.status(200).json({
      success: true,
      message: 'Chat eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar chat:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el chat',
      error: error.message
    });
  }
};