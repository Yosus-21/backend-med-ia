export const setupSocketEvents = (io) => {
  io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    // Unirse a sala de usuario
    socket.on('join-user-room', (userId) => {
      socket.join(`user-${userId}`);
    });

    // Unirse a sala de chat
    socket.on('join-chat', (chatId) => {
      socket.join(`chat-${chatId}`);
    });

    // Manejar mensajes de chat
    socket.on('send-message', async (data) => {
      try {
        // Emitir el mensaje a todos los usuarios en la sala del chat
        io.to(`chat-${data.chatId}`).emit('new-message', {
          ...data,
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Error al manejar mensaje:', error);
      }
    });

    // Notificaciones de citas
    socket.on('appointment-notification', (data) => {
      // Emitir notificación a paciente y doctor
      io.to(`user-${data.patientId}`).emit('notification', data);
      io.to(`user-${data.doctorId}`).emit('notification', data);
    });

    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
    });
  });
};