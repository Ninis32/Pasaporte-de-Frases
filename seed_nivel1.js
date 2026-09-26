require('dotenv').config();

const mongoose = require('mongoose');
const Etapa = require('./models/Etapa');

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

const etapasNivel1 = [
  {
    nivel: 1,
    orden: 1,
    tipo: 'seleccion',

    instruccion: '¿Cómo dices esto en inglés?',
    pregunta: 'Hola, ¿cómo estás?',

    frase_ingles: 'Hello, how are you?',
    frase_traduccion: 'Hola, ¿cómo estás?',

    opciones: [
      'Hello, how are you?',
      'See you tomorrow',
      'What is your name?'
    ],

    respuesta_correcta: 'Hello, how are you?',

    explicacion:
      '"Hello" significa "Hola" y "How are you?" significa "¿Cómo estás?". Es una forma común y amable de saludar.',

    dificultad: 1
  },

  {
    nivel: 1,
    orden: 2,
    tipo: 'traduccion',

    instruccion: '¿Qué significa esta frase?',
    pregunta: 'Where is the bathroom?',

    frase_ingles: 'Where is the bathroom?',
    frase_traduccion: '¿Dónde está el baño?',

    opciones: [
      '¿Dónde está el baño?',
      '¿Cuánto cuesta?',
      '¿Dónde está el hotel?'
    ],

    respuesta_correcta: '¿Dónde está el baño?',

    explicacion:
      '"Where" significa "dónde" y "bathroom" significa "baño". Usamos "Where is...?" para preguntar dónde se encuentra algo.',

    dificultad: 1
  },

  {
    nivel: 1,
    orden: 3,
    tipo: 'completar',

    instruccion: 'Completa la frase',
    pregunta: 'How much ___ it cost?',

    frase_ingles: 'How much does it cost?',
    frase_traduccion: '¿Cuánto cuesta?',

    opciones: [
      'does',
      'do',
      'is'
    ],

    respuesta_correcta: 'does',

    explicacion:
      'Usamos "does" porque el sujeto "it" es tercera persona singular. Después de "does", el verbo queda en su forma base: "cost". Por eso decimos "does it cost" y no "does it costs".',

    dificultad: 1
  },

  {
    nivel: 1,
    orden: 4,
    tipo: 'situacion',

    instruccion: 'Estás perdido y necesitas ayuda',
    pregunta: '¿Qué dirías para pedir ayuda?',

    frase_ingles: 'Can you help me, please?',
    frase_traduccion: '¿Puedes ayudarme, por favor?',

    opciones: [
      'Can you help me, please?',
      'I would like a coffee.',
      'Where is the bathroom?'
    ],

    respuesta_correcta: 'Can you help me, please?',

    explicacion:
      '"Can you help me, please?" es una forma educada de pedir ayuda. "Can you...?" se utiliza para preguntar si alguien puede hacer algo.',

    dificultad: 2
  },

  {
    nivel: 1,
    orden: 5,
    tipo: 'ordenar',

    instruccion: 'Ordena las palabras',
    pregunta: 'Forma correctamente la frase',

    frase_ingles: 'I would like a coffee',
    frase_traduccion: 'Quisiera un café',

    opciones: [
      'I',
      'would',
      'like',
      'a',
      'coffee'
    ],

    respuesta_correcta: 'I would like a coffee',

    explicacion:
      '"I would like..." es una forma educada de decir "Quisiera...". Se utiliza mucho para pedir comida o bebidas.',

    dificultad: 2
  },

  {
    nivel: 1,
    orden: 6,
    tipo: 'seleccion',

    instruccion: '¿Cómo preguntas esto en inglés?',
    pregunta: '¿A qué hora abre?',

    frase_ingles: 'What time does it open?',
    frase_traduccion: '¿A qué hora abre?',

    opciones: [
      'What time does it open?',
      'What time is it?',
      'Where does it open?'
    ],

    respuesta_correcta: 'What time does it open?',

    explicacion:
      '"What time" significa "a qué hora". La estructura "What time does it open?" pregunta a qué hora comienza a funcionar un lugar.',

    dificultad: 2
  },

  {
    nivel: 1,
    orden: 7,
    tipo: 'traduccion',

    instruccion: '¿Qué significa esta frase?',
    pregunta: 'I am allergic to nuts',

    frase_ingles: 'I am allergic to nuts',
    frase_traduccion: 'Soy alérgico a las nueces',

    opciones: [
      'Tengo hambre',
      'Soy alérgico a las nueces',
      'No me gustan las nueces'
    ],

    respuesta_correcta: 'Soy alérgico a las nueces',

    explicacion:
      '"I am allergic to..." significa "Soy alérgico a...". Es una frase especialmente útil cuando estás viajando y necesitas informar sobre una alergia alimentaria.',

    dificultad: 3
  },

  {
    nivel: 1,
    orden: 8,
    tipo: 'situacion',

    instruccion: 'Estás viajando con amigos',
    pregunta: 'Quieres pedirle a alguien que les tome una foto. ¿Qué dices?',

    frase_ingles: 'Could you take a picture of us?',
    frase_traduccion: '¿Podrías tomarnos una foto?',

    opciones: [
      'Could you take a picture of us?',
      'Where can I park?',
      'I need a taxi.'
    ],

    respuesta_correcta: 'Could you take a picture of us?',

    explicacion:
      '"Could you...?" es una forma educada de pedir algo. "Take a picture" significa "tomar una foto" y "of us" significa "de nosotros".',

    dificultad: 3
  },

  {
    nivel: 1,
    orden: 9,
    tipo: 'ordenar',

    instruccion: 'Ordena las palabras',
    pregunta: 'Forma correctamente la pregunta',

    frase_ingles: 'Is this seat taken?',
    frase_traduccion: '¿Está ocupado este asiento?',

    opciones: [
      'Is',
      'this',
      'seat',
      'taken?'
    ],

    respuesta_correcta: 'Is this seat taken?',

    explicacion:
      '"Is this seat taken?" significa "¿Está ocupado este asiento?". Es una pregunta útil cuando estás en un avión, tren, restaurante o lugar público.',

    dificultad: 3
  },

  {
    nivel: 1,
    orden: 10,
    tipo: 'completar',

    instruccion: 'Completa la frase',
    pregunta: "Follow that river and you ___ miss it.",

    frase_ingles: "Follow that river and you can't miss it",
    frase_traduccion: 'Sigue ese río y no puedes perderlo',

    opciones: [
      "can't",
      "don't",
      "aren't"
    ],

    respuesta_correcta: "can't",

    explicacion:
      '"Can\'t" significa "no puedes". La expresión "you can\'t miss it" se usa para decir que algo es muy fácil de encontrar o que es imposible no verlo.',

    dificultad: 4
  }
];

const cargarNivel1 = async () => {

  try {

    await conectarDB();

    // Elimina solamente las etapas del Nivel 1
    await Etapa.deleteMany({
      nivel: 1
    });

    // Inserta las nuevas etapas
    await Etapa.insertMany(
      etapasNivel1
    );

    console.log(
      `Nivel 1 poblado con ${etapasNivel1.length} etapas`
    );

    console.log(
      'Etapas creadas correctamente con traducciones y explicaciones.'
    );

  } catch (error) {

    console.error(
      'Error cargando Nivel 1:',
      error.message
    );

  } finally {

    await mongoose.connection.close();

  }
};

cargarNivel1();