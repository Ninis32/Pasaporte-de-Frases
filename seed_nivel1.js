// Script de ejemplo para poblar el nivel 1 con 10 frases básicas.
// Correr con: node seed_nivel1.js
require('dotenv').config();
const mongoose = require('mongoose');
const Etapa = require('./models/Etapa');

const etapasNivel1 = [
  { nivel: 1, orden: 1, frase_ingles: 'Hello, how are you?', frase_traduccion: 'Hola, ¿cómo estás?', respuesta_correcta: 'Hello, how are you?', opciones: ['Hello, how are you?', 'Good bye friend', 'What time is it?'], dificultad: 1 },
  { nivel: 1, orden: 2, frase_ingles: 'Where is the bathroom?', frase_traduccion: '¿Dónde está el baño?', respuesta_correcta: 'Where is the bathroom?', opciones: ['Where is the bathroom?', 'I like pizza', 'See you later'], dificultad: 1 },
  { nivel: 1, orden: 3, frase_ingles: 'How much does it cost?', frase_traduccion: '¿Cuánto cuesta?', respuesta_correcta: 'How much does it cost?', opciones: ['How much does it cost?', 'I am tired', 'Nice to meet you'], dificultad: 1 },
  { nivel: 1, orden: 4, frase_ingles: 'Can you help me, please?', frase_traduccion: '¿Puedes ayudarme, por favor?', respuesta_correcta: 'Can you help me, please?', opciones: ['Can you help me, please?', 'I am from Chile', 'What is your name?'], dificultad: 2 },
  { nivel: 1, orden: 5, frase_ingles: 'I would like a coffee', frase_traduccion: 'Quisiera un café', respuesta_correcta: 'I would like a coffee', opciones: ['I would like a coffee', 'The airport is far', 'I need a taxi'], dificultad: 2 },
  { nivel: 1, orden: 6, frase_ingles: 'What time does it open?', frase_traduccion: '¿A qué hora abre?', respuesta_correcta: 'What time does it open?', opciones: ['What time does it open?', 'I lost my passport', 'Turn left here'], dificultad: 2 },
  { nivel: 1, orden: 7, frase_ingles: 'I am allergic to nuts', frase_traduccion: 'Soy alérgico a las nueces', respuesta_correcta: 'I am allergic to nuts', opciones: ['I am allergic to nuts', 'It is very cold today', 'The train is late'], dificultad: 3 },
  { nivel: 1, orden: 8, frase_ingles: 'Could you take a picture of us?', frase_traduccion: '¿Podrías tomarnos una foto?', respuesta_correcta: 'Could you take a picture of us?', opciones: ['Could you take a picture of us?', 'I need to check in', 'Where can I park?'], dificultad: 3 },
  { nivel: 1, orden: 9, frase_ingles: 'Is this seat taken?', frase_traduccion: '¿Está ocupado este asiento?', respuesta_correcta: 'Is this seat taken?', opciones: ['Is this seat taken?', 'The weather is nice', 'I forgot my keys'], dificultad: 3 },
  { nivel: 1, orden: 10, frase_ingles: "Follow that river and you can't miss it", frase_traduccion: 'Sigue ese río y no puedes perderlo', respuesta_correcta: "Follow that river and you can't miss it", opciones: ["Follow that river and you can't miss it", 'I have a reservation', 'This is delicious'], dificultad: 4 },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Etapa.deleteMany({ nivel: 1 });
  await Etapa.insertMany(etapasNivel1);
  console.log('Nivel 1 poblado con 10 etapas');
  process.exit(0);
}

seed();
