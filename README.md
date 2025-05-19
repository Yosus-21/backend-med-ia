# backend-med-ia

DOCUMENTO DE PROYECTO: APLICACIÓN DE SALUD CON CHATBOT DE IA

1. INTRODUCCIÓN

Este documento describe el desarrollo de una aplicación móvil de salud con un chatbot de IA que permita a pacientes consultar sobre posibles diagnósticos preliminares de sus síntomas y gestionar citas médicas. La aplicación también ofrece a los médicos herramientas para gestionar sus citas y acceder a historiales médicos básicos de sus pacientes.

2. OBJETIVOS

Desarrollar una aplicación intuitiva para la consulta preliminar de malestares.

Implementar un chatbot que analice síntomas y sugiera posibles diagnósticos.

Facilitar la gestión de citas médicas entre pacientes y doctores.

Proporcionar acceso seguro a historiales médicos básicos.

3. DESCRIPCIÓN DEL SISTEMA

3.1 Módulos para Pacientes

Chatbot de IA (HOME)

Conversaciones con la IA sobre síntomas

Almacenamiento de conversaciones previas

Diagnósticos preliminares con advertencia clara

Citas

Solicitud de citas médicas

Selección de especialidades, doctores, fechas y horas disponibles

Detalle del motivo de consulta

Historial de Citas

Visualización de citas pasadas y futuras

Estado de las citas (solicitada, aceptada, completada, etc.)

Notas del médico tras la consulta (cuando esté disponible)

Configuración

Información personal del paciente

Historial médico básico (alergias, condiciones preexistentes)

3.2 Módulos para Doctores

Gestión de Citas

Visualización de citas solicitadas

Aceptación o rechazo de solicitudes

Eliminación o reprogramación de citas

Pacientes

Listado de pacientes asignados

Acceso al historial médico básico

Historial de conversaciones del paciente con la IA

Configuración

Información personal y profesional

Gestión de horarios disponibles

4. MODELO DE DATOS

Entidades y Relaciones

La aplicación utilizará el siguiente esquema de base de datos:

Usuario: Base para pacientes y doctores

Paciente: Hereda de Usuario

Doctor: Hereda de Usuario

HistorialMedico: Vinculado a Paciente (1:1)

Cita: Vincula Paciente y Doctor

ChatIA: Almacena conversaciones del paciente con la IA

Estructura de la Base de Datos

El sistema se implementará usando MySQL con las siguientes tablas:

Usuario (id_usuario, nombre, apellidos, email, contrasena, telefono, tipo_usuario)

Paciente (id_paciente, fecha_nacimiento, genero, direccion)

Doctor (id_doctor, especialidad, numero_licencia, horario_disponibilidad)

HistorialMedico (id_historial, id_paciente, alergias, enfermedades_preexistentes, medicamentos)

Cita (id_cita, id_paciente, id_doctor, fecha, hora_inicio, hora_fin, estado, motivo, notas)

ChatIA (id_chat, id_paciente, fecha_inicio, fecha_ultima_interaccion, titulo, mensajes)

5. TECNOLOGÍAS

Frontend: React Native para aplicaciones móviles multiplataforma (iOS y Android)

Backend: Node.js con Express para la API RESTful

Base de Datos: MySQL para almacenamiento de datos

Chatbot IA: Implementación basada en un modelo de lenguaje pre-entrenado

6. ARQUITECTURA

6.1 Arquitectura General

La aplicación seguirá una arquitectura cliente-servidor:

Cliente: Aplicación React Native (interfaces para pacientes y doctores)

Servidor: API RESTful en Node.js/Express

Base de datos: MySQL para persistencia de datos

Integración de IA: API para procesamiento de lenguaje natural

6.2 Flujo de Datos

El usuario interactúa con la interfaz de React Native

Las solicitudes se envían a la API RESTful

El servidor procesa las solicitudes y consulta/actualiza la base de datos

Las consultas al chatbot son procesadas por el servicio de IA

Las respuestas se devuelven al cliente para su visualización

7. INTERFACES DE USUARIO

7.1 App para Pacientes

Pantalla de inicio/login: Autenticación de usuarios

Home (Chatbot): Interfaz de chat con historial de conversaciones

Citas: Formulario de solicitud y calendario

Historial de Citas: Listado cronológico con detalles

Configuración: Formularios para datos personales y médicos

7.2 App para Doctores

Pantalla de inicio/login: Autenticación especializada

Gestión de Citas: Listado de solicitudes con acciones

Pacientes: Directorio con fichas de pacientes

Configuración: Datos profesionales y disponibilidad

8. SEGURIDAD

Autenticación segura con tokens JWT

Cifrado de datos sensibles en reposo y en tránsito

Control de acceso basado en roles (RBAC)

Cumplimiento con regulaciones médicas aplicables

9. IMPLEMENTACIÓN

9.1 Fases de Desarrollo

Diseño detallado: UI/UX y arquitectura técnica

Desarrollo backend: API RESTful y base de datos

Implementación del chatbot de IA: Integración con modelo de NLP

Desarrollo frontend: Aplicación móvil React Native

Integración y pruebas: Asegurar funcionamiento correcto

Despliegue: Publicación en tiendas de aplicaciones

9.2 Pruebas

Pruebas unitarias de componentes

Pruebas de integración de módulos

Pruebas de usuario para validar usabilidad

Pruebas de seguridad y penetración

10. LIMITACIONES Y CONSIDERACIONES

El diagnóstico del chatbot es solo orientativo y no sustituye la consulta médica profesional

La aplicación no está diseñada para emergencias médicas

Se requiere conexión a internet para utilizar todas las funcionalidades

13. CONCLUSIONES

Esta aplicación de salud con chatbot de IA tiene el potencial de mejorar el acceso inicial a la atención médica, facilitando diagnósticos preliminares y la gestión de citas. Aunque es una solución simple, su implementación ayudará a optimizar el tiempo tanto de pacientes como de profesionales médicos.




### Documentación del Backend: Sistema de Salud con IA

#### Descripción General
El backend desarrollado es una aplicación de salud con integración de chatbot de IA, diseñada para facilitar la comunicación entre pacientes y médicos, gestionar citas médicas y proporcionar asistencia médica preliminar mediante inteligencia artificial.

#### Arquitectura del Sistema
##### Tecnologías Principales
- Node.js con Express: Framework para el servidor web
- MySQL con Sequelize: Base de datos relacional y ORM
- Socket.IO: Comunicación en tiempo real
- JWT: Autenticación de usuarios
- OpenAI/LM Studio: Integración con modelos de IA para el chatbot médico

##### Componentes Clave
###### 1. Modelos de Datos
El sistema utiliza una estructura de modelos relacionales que incluye:

- Usuario: Modelo base para todos los usuarios del sistema
- Paciente: Extiende Usuario con información específica del paciente
- Doctor: Extiende Usuario con información específica del médico
- HistorialMédico: Registros médicos de los pacientes
- Cita: Gestión de citas entre pacientes y médicos
- ChatIA: Conversaciones de pacientes con el asistente de IA
- MensajeChat: Mensajes individuales dentro de una conversación con IA

###### 2. Autenticación y Seguridad
- Sistema de autenticación basado en JWT
- Middleware para verificación de roles (paciente/doctor)
- Protección de rutas según permisos de usuario
- Almacenamiento seguro de contraseñas con bcrypt

###### 3. API RESTful
Endpoints organizados por funcionalidad:

- /api/usuarios: Registro, login y gestión de perfiles
- /api/pacientes: Operaciones específicas para pacientes
- /api/doctores: Operaciones específicas para médicos
- /api/citas: Gestión de citas médicas
- /api/chat: Interacción con el chatbot de IA
- /api/historial-medico: Gestión de historiales médicos

###### 4. Integración con IA
- Conexión con modelos de lenguaje (OpenAI/LM Studio)
- Sistema de prompts médicos especializados
- Análisis preliminar de síntomas
- Generación de respuestas contextualizadas
- Capacidad para generar títulos automáticos para conversaciones

###### 5. Comunicación en Tiempo Real
- Implementación de WebSockets con Socket.IO
- Notificaciones instantáneas para:
  - Actualizaciones de citas
  - Nuevos mensajes en chats
  - Alertas médicas

#### Flujos Principales
##### Registro y Autenticación
1. El usuario se registra proporcionando datos básicos y tipo (paciente/doctor)
2. El sistema valida los datos y crea el registro en la base de datos
3. Para iniciar sesión, el usuario proporciona credenciales y recibe un token JWT
4. El token se utiliza para autenticar todas las solicitudes posteriores

##### Consulta con IA
1. El paciente inicia una conversación con el asistente de IA
2. El sistema crea un nuevo chat y almacena los mensajes
3. Las consultas del paciente se procesan a través de la API de OpenAI/LM Studio
4. El sistema aplica un prompt especializado en medicina para contextualizar las respuestas
5. Las respuestas se envían al paciente y se almacenan en la base de datos

##### Gestión de Citas
1. El paciente solicita una cita con un doctor específico
2. El sistema verifica la disponibilidad del doctor
3. Se crea la cita y se notifica a ambas partes
4. Las actualizaciones de estado de la cita se comunican en tiempo real

#### Configuración y Despliegue
##### Variables de Entorno
El sistema utiliza un archivo .env para configurar:

- Conexión a la base de datos
- Claves secretas para JWT
- Configuración de OpenAI/LM Studio
- Puertos y URLs del servidor

##### Inicialización
```bash
# Instalar dependencias
npm install

# Iniciar en desarrollo
npm run dev

# Iniciar en producción
npm start
