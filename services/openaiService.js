import { openai, OPENAI_MODEL, SYSTEM_PROMPT } from '../config/openai.js';

// Función para generar una respuesta del chatbot basada en la conversación
export const generateAIResponse = async (messages) => {
  try {
    // Preparar los mensajes para la API de OpenAI
    const formattedMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map(msg => ({
        role: msg.es_ia ? 'assistant' : 'user',
        content: msg.contenido
      }))
    ];

    // Realizar la solicitud a la API de OpenAI
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 500,
    });

    // Extraer y devolver la respuesta generada
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error al generar respuesta de IA:', error);
    throw new Error('No se pudo generar una respuesta. Por favor, intenta de nuevo más tarde.');
  }
};

// Función para analizar síntomas y proporcionar un diagnóstico preliminar
export const analyzeSymptomsForDiagnosis = async (symptoms) => {
  try {
    const prompt = `
      Como asistente médico virtual, analiza los siguientes síntomas y proporciona un posible diagnóstico preliminar:
      
      Síntomas: ${symptoms}
      
      Proporciona la siguiente información:
      1. Posibles condiciones médicas (máximo 3)
      2. Nivel de urgencia (bajo, medio, alto)
      3. Recomendaciones generales
      4. Cuándo buscar atención médica profesional
      
      IMPORTANTE: Aclara que este es solo un diagnóstico preliminar y no sustituye la consulta con un profesional médico.
    `;

    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 800,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error al analizar síntomas:', error);
    throw new Error('No se pudo analizar los síntomas. Por favor, intenta de nuevo más tarde.');
  }
};

// Función para generar un título descriptivo para una conversación basado en los primeros mensajes
export const generateChatTitle = async (firstMessage) => {
  try {
    const prompt = `
      Genera un título breve y descriptivo (máximo 5 palabras) para una conversación médica que comienza con el siguiente mensaje del paciente:
      
      "${firstMessage}"
      
      El título debe ser conciso y reflejar el tema principal de la consulta.
    `;

    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: 'Eres un asistente que genera títulos concisos para conversaciones médicas.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 20,
    });

    // Limpiar el título (eliminar comillas y caracteres especiales)
    let title = response.choices[0].message.content.trim();
    title = title.replace(/["']/g, '');
    
    return title;
  } catch (error) {
    console.error('Error al generar título de chat:', error);
    return 'Nueva conversación';
  }
};