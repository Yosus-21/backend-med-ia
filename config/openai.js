import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Configuración para LM Studio
const LMSTUDIO_API_URL = 'http://127.0.0.1:1234/v1';

// Configuración del cliente
const openai = new OpenAI({
  baseURL: LMSTUDIO_API_URL,
  apiKey: 'not-needed' // LM Studio no requiere API key
});

// Modelo a utilizar para el chatbot
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

// Configuración del sistema para el chatbot médico
const SYSTEM_PROMPT = `
Eres un asistente médico virtual diseñado para ayudar a pacientes con consultas preliminares.
Tu objetivo es recopilar información sobre síntomas, proporcionar información general sobre posibles condiciones
y recomendar cuándo es necesario buscar atención médica profesional.

IMPORTANTE:
1. NO debes proporcionar diagnósticos definitivos.
2. SIEMPRE debes aclarar que tus respuestas son orientativas y no sustituyen la consulta con un profesional médico.
3. Ante síntomas graves o de emergencia, debes recomendar buscar atención médica inmediata.
4. Mantén un tono profesional pero amigable y empático.
5. Solicita información adicional cuando sea necesario para entender mejor la situación del paciente.
`;

// Función para generar una respuesta del chatbot
const generateChatResponse = async (messages) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'local-model', // El modelo que hayas cargado en LM Studio
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error al generar respuesta del chatbot:', error);
    throw new Error('No se pudo generar una respuesta. Por favor, intenta de nuevo más tarde.');
  }
};

export { openai, LMSTUDIO_API_URL, SYSTEM_PROMPT, generateChatResponse };