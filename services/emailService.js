import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configuración del transporte de correo
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Función para enviar un correo electrónico
export const sendEmail = async (to, subject, html) => {
  try {
    // Verificar si la configuración de correo está disponible
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn('Configuración de correo no disponible. Email no enviado.');
      return false;
    }

    // Configurar opciones del correo
    const mailOptions = {
      from: `"Aplicación de Salud" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    // Enviar el correo
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error al enviar correo:', error);
    return false;
  }
};

// Plantilla para notificación de nueva cita
export const sendAppointmentConfirmation = async (userEmail, userName, doctorName, date, time) => {
  const subject = 'Confirmación de Cita Médica';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #4a90e2;">Confirmación de Cita Médica</h2>
      <p>Hola <strong>${userName}</strong>,</p>
      <p>Tu cita médica ha sido programada exitosamente:</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <p><strong>Doctor:</strong> ${doctorName}</p>
        <p><strong>Fecha:</strong> ${date}</p>
        <p><strong>Hora:</strong> ${time}</p>
      </div>
      <p>Recuerda llegar 15 minutos antes de tu cita.</p>
      <p>Si necesitas cancelar o reprogramar, por favor hazlo con al menos 24 horas de anticipación.</p>
      <p style="margin-top: 30px; font-size: 12px; color: #777;">
        Este es un correo automático, por favor no respondas a este mensaje.
      </p>
    </div>
  `;

  return await sendEmail(userEmail, subject, html);
};

// Plantilla para notificación de cambio de estado de cita
export const sendAppointmentStatusUpdate = async (userEmail, userName, doctorName, date, time, status) => {
  let statusText = '';
  let subject = '';

  switch (status) {
    case 'aceptada':
      statusText = 'aceptada';
      subject = 'Tu cita médica ha sido confirmada';
      break;
    case 'rechazada':
      statusText = 'rechazada';
      subject = 'Tu cita médica ha sido rechazada';
      break;
    case 'cancelada':
      statusText = 'cancelada';
      subject = 'Tu cita médica ha sido cancelada';
      break;
    case 'completada':
      statusText = 'completada';
      subject = 'Resumen de tu cita médica';
      break;
    default:
      statusText = 'actualizada';
      subject = 'Actualización de tu cita médica';
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #4a90e2;">Actualización de Cita Médica</h2>
      <p>Hola <strong>${userName}</strong>,</p>
      <p>Tu cita médica ha sido <strong>${statusText}</strong>:</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <p><strong>Doctor:</strong> ${doctorName}</p>
        <p><strong>Fecha:</strong> ${date}</p>
        <p><strong>Hora:</strong> ${time}</p>
        <p><strong>Estado:</strong> ${statusText}</p>
      </div>
      ${status === 'rechazada' ? '<p>Por favor, considera programar una nueva cita en un horario diferente.</p>' : ''}
      ${status === 'completada' ? '<p>Gracias por tu visita. No olvides seguir las recomendaciones médicas.</p>' : ''}
      <p style="margin-top: 30px; font-size: 12px; color: #777;">
        Este es un correo automático, por favor no respondas a este mensaje.
      </p>
    </div>
  `;

  return await sendEmail(userEmail, subject, html);
};

// Plantilla para recordatorio de cita
export const sendAppointmentReminder = async (userEmail, userName, doctorName, date, time) => {
  const subject = 'Recordatorio de Cita Médica';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #4a90e2;">Recordatorio de Cita Médica</h2>
      <p>Hola <strong>${userName}</strong>,</p>
      <p>Te recordamos que tienes una cita médica programada para mañana:</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <p><strong>Doctor:</strong> ${doctorName}</p>
        <p><strong>Fecha:</strong> ${date}</p>
        <p><strong>Hora:</strong> ${time}</p>
      </div>
      <p>Recuerda llegar 15 minutos antes de tu cita.</p>
      <p>Si necesitas cancelar, por favor hazlo lo antes posible.</p>
      <p style="margin-top: 30px; font-size: 12px; color: #777;">
        Este es un correo automático, por favor no respondas a este mensaje.
      </p>
    </div>
  `;

  return await sendEmail(userEmail, subject, html);
};