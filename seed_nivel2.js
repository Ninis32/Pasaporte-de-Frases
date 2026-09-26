require('dotenv').config();

const mongoose = require('mongoose');
const Etapa = require('./models/Etapa');


const conectarDB = async () => {
  try {

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      'MongoDB conectado'
    );

  } catch (error) {

    console.error(
      'Error conectando a MongoDB:',
      error.message
    );

    process.exit(1);
  }
};


// =====================================================
// NIVEL 2
// INGLÉS PARA SITUACIONES COTIDIANAS
// =====================================================

const etapasNivel2 = [

  // ===================================================
  // ETAPA 1
  // ===================================================

  {
    nivel: 2,
    orden: 1,

    nombre:
      'Presentaciones',

    descripcion:
      'Aprende a presentarte y conocer a otras personas en inglés.',

    frases: [

      {
        ingles:
          'Hello! How are you?',

        traduccion:
          '¡Hola! ¿Cómo estás?',

        explicacion:
          '"Hello" significa "Hola" y "How are you?" significa "¿Cómo estás?".',

        pronunciacion:
          'Jelóu! Jáu ar iú?'
      },

      {
        ingles:
          "What's your name?",

        traduccion:
          '¿Cómo te llamas?',

        explicacion:
          '"What is your name?" se utiliza para preguntar el nombre de una persona.',

        pronunciacion:
          'Uats ior néim?'
      },

      {
        ingles:
          'My name is Ninoska.',

        traduccion:
          'Me llamo Ninoska.',

        explicacion:
          'Puedes cambiar "Ninoska" por tu propio nombre.',

        pronunciacion:
          'Mai néim is Ninoska.'
      },

      {
        ingles:
          'Nice to meet you.',

        traduccion:
          'Encantado/a de conocerte.',

        explicacion:
          'Es una expresión habitual cuando conoces a alguien por primera vez.',

        pronunciacion:
          'Náis tu mít iú.'
      },

      {
        ingles:
          'See you later!',

        traduccion:
          '¡Nos vemos más tarde!',

        explicacion:
          '"See you later" es una forma informal de despedirse.',

        pronunciacion:
          'Sí iú léiter.'
      }

    ],

    ejercicios: [

      {
        tipo:
          'seleccion',

        instruccion:
          'Elige la frase correcta',

        pregunta:
          '¿Cómo dices "¿Cómo te llamas?"?',

        frase_ingles:
          "What's your name?",

        frase_traduccion:
          '¿Cómo te llamas?',

        opciones: [
          "What's your name?",
          'How old are you?',
          'Where are you from?'
        ],

        respuesta_correcta:
          "What's your name?",

        explicacion:
          '"What\'s your name?" significa "¿Cómo te llamas?".'
      },


      {
        tipo:
          'traduccion',

        instruccion:
          '¿Qué significa esta frase?',

        pregunta:
          'Nice to meet you.',

        frase_ingles:
          'Nice to meet you.',

        frase_traduccion:
          'Encantado/a de conocerte.',

        opciones: [
          'Encantado/a de conocerte.',
          'Nos vemos mañana.',
          '¿Cómo estás?'
        ],

        respuesta_correcta:
          'Encantado/a de conocerte.',

        explicacion:
          'Se utiliza cuando conoces a alguien por primera vez.'
      },


      {
        tipo:
          'completar',

        instruccion:
          'Completa la frase',

        pregunta:
          'My ___ is Ninoska.',

        frase_ingles:
          'My name is Ninoska.',

        frase_traduccion:
          'Me llamo Ninoska.',

        opciones: [
          'name',
          'friend',
          'house'
        ],

        respuesta_correcta:
          'name',

        explicacion:
          '"My name is..." significa "Me llamo..." o literalmente "Mi nombre es...".'
      },


      {
        tipo:
          'ordenar',

        instruccion:
          'Ordena las palabras',

        pregunta:
          'Forma correctamente la frase',

        frase_ingles:
          'Nice to meet you.',

        frase_traduccion:
          'Encantado/a de conocerte.',

        opciones: [
          'Nice',
          'to',
          'meet',
          'you.'
        ],

        respuesta_correcta:
          'Nice to meet you.',

        explicacion:
          'La estructura correcta es "Nice to meet you".'
      },


      {
        tipo:
          'situacion',

        instruccion:
          'Conoces a una persona nueva',

        pregunta:
          'La persona te dice: "Hello! What\'s your name?" ¿Qué responderías?',

        frase_ingles:
          'My name is Ninoska.',

        frase_traduccion:
          'Me llamo Ninoska.',

        opciones: [
          'My name is Ninoska.',
          'See you later.',
          'I would like a coffee.'
        ],

        respuesta_correcta:
          'My name is Ninoska.',

        explicacion:
          'Después de que alguien pregunte tu nombre puedes responder "My name is..." seguido de tu nombre.'
      },


      {
        tipo:
          'desafio',

        instruccion:
          '🏆 Desafío final',

        pregunta:
          'Alguien te saluda, te pregunta tu nombre y quieres responder de forma natural.',

        frase_ingles:
          "Hello! I'm Ninoska. Nice to meet you.",

        frase_traduccion:
          '¡Hola! Soy Ninoska. Encantado/a de conocerte.',

        opciones: [
          "Hello! I'm Ninoska. Nice to meet you.",
          'Where is the bathroom?',
          'I need a taxi.'
        ],

        respuesta_correcta:
          "Hello! I'm Ninoska. Nice to meet you.",

        explicacion:
          'Esta es una pequeña combinación de las frases aprendidas durante la etapa.'
      }

    ],

    desafio: {

      titulo:
        '🏆 Desafío de presentación',

      descripcion:
        'Utiliza las frases aprendidas para presentarte ante una persona nueva.'
    }
  },


  // ===================================================
  // ETAPA 2
  // ===================================================

  {
    nivel: 2,
    orden: 2,

    nombre:
      'Pedir algo',

    descripcion:
      'Aprende a pedir comida, bebidas y otras cosas de forma educada.',

    frases: [

      {
        ingles:
          'I would like a coffee.',

        traduccion:
          'Quisiera un café.',

        explicacion:
          '"I would like..." es una forma educada de pedir algo.',

        pronunciacion:
          'Ai wud laik a cófi.'
      },

      {
        ingles:
          'Can I have some water, please?',

        traduccion:
          '¿Me puede dar un poco de agua, por favor?',

        explicacion:
          '"Can I have...?" se usa para pedir algo.',

        pronunciacion:
          'Can ai jav sam uóter plis?'
      },

      {
        ingles:
          'Could I have the menu, please?',

        traduccion:
          '¿Podría traerme el menú, por favor?',

        explicacion:
          '"Could I have...?" es una forma especialmente educada de pedir algo.',

        pronunciacion:
          'Cud ai jav de menú plis?'
      },

      {
        ingles:
          'I would like some fries.',

        traduccion:
          'Quisiera unas papas fritas.',

        explicacion:
          'Puedes utilizar "I would like..." antes de diferentes comidas o bebidas.',

        pronunciacion:
          'Ai wud laik sam frais.'
      }

    ],

    ejercicios: [

      {
        tipo:
          'seleccion',

        instruccion:
          'Elige la frase correcta',

        pregunta:
          '¿Cómo dices "Quisiera un café"?',

        frase_ingles:
          'I would like a coffee.',

        frase_traduccion:
          'Quisiera un café.',

        opciones: [
          'I would like a coffee.',
          'I need to leave.',
          'Where is the hotel?'
        ],

        respuesta_correcta:
          'I would like a coffee.',

        explicacion:
          '"I would like..." significa "Quisiera..." y es muy útil para pedir cosas.'
      },


      {
        tipo:
          'traduccion',

        instruccion:
          'Traduce la frase',

        pregunta:
          'Could I have the menu, please?',

        frase_ingles:
          'Could I have the menu, please?',

        frase_traduccion:
          '¿Podría traerme el menú, por favor?',

        opciones: [
          '¿Podría traerme el menú, por favor?',
          '¿Dónde está el restaurante?',
          'Quiero pagar ahora.'
        ],

        respuesta_correcta:
          '¿Podría traerme el menú, por favor?',

        explicacion:
          '"Could I have...?" permite realizar una petición de manera educada.'
      },


      {
        tipo:
          'completar',

        instruccion:
          'Completa la frase',

        pregunta:
          'I would ___ a coffee.',

        frase_ingles:
          'I would like a coffee.',

        frase_traduccion:
          'Quisiera un café.',

        opciones: [
          'like',
          'want',
          'need'
        ],

        respuesta_correcta:
          'like',

        explicacion:
          'La estructura correcta es "I would like..." para expresar un pedido de forma educada.'
      },


      {
        tipo:
          'ordenar',

        instruccion:
          'Ordena las palabras',

        pregunta:
          'Forma correctamente la frase',

        frase_ingles:
          'I would like some fries.',

        frase_traduccion:
          'Quisiera unas papas fritas.',

        opciones: [
          'I',
          'would',
          'like',
          'some',
          'fries.'
        ],

        respuesta_correcta:
          'I would like some fries.',

        explicacion:
          'La estructura es "I would like + cosa".'
      },


      {
        tipo:
          'desafio',

        instruccion:
          '🏆 Desafío final',

        pregunta:
          'Estás en una cafetería y quieres pedir un café de forma educada.',

        frase_ingles:
          'I would like a coffee, please.',

        frase_traduccion:
          'Quisiera un café, por favor.',

        opciones: [
          'I would like a coffee, please.',
          'Where is the bathroom?',
          'What is your name?'
        ],

        respuesta_correcta:
          'I would like a coffee, please.',

        explicacion:
          'Has utilizado la estructura aprendida para realizar un pedido.'
      }

    ],

    desafio: {

      titulo:
        '🏆 Desafío en la cafetería',

      descripcion:
        'Realiza un pedido utilizando una de las estructuras aprendidas.'
    }
  },


  // ===================================================
  // ETAPA 3
  // ===================================================

  {
    nivel: 2,
    orden: 3,

    nombre:
      'Preguntar direcciones',

    descripcion:
      'Aprende a preguntar dónde están los lugares y cómo llegar.',

    frases: [

      {
        ingles:
          'Where is the bathroom?',

        traduccion:
          '¿Dónde está el baño?',

        explicacion:
          '"Where is..." significa "¿Dónde está...?".',

        pronunciacion:
          'Uér is de báthrum?'
      },

      {
        ingles:
          'Where is the train station?',

        traduccion:
          '¿Dónde está la estación de tren?',

        explicacion:
          'Puedes utilizar la misma estructura con diferentes lugares.',

        pronunciacion:
          'Uér is de trein stéishon?'
      },

      {
        ingles:
          'How do I get to the hotel?',

        traduccion:
          '¿Cómo llego al hotel?',

        explicacion:
          '"How do I get to...?" pregunta cómo llegar a un lugar.',

        pronunciacion:
          'Jáu du ai get tu de joutél?'
      }

    ],

    ejercicios: [

      {
        tipo:
          'seleccion',

        instruccion:
          'Elige la frase correcta',

        pregunta:
          '¿Cómo preguntas dónde está el baño?',

        frase_ingles:
          'Where is the bathroom?',

        frase_traduccion:
          '¿Dónde está el baño?',

        opciones: [
          'Where is the bathroom?',
          'How much is the bathroom?',
          'What is the bathroom?'
        ],

        respuesta_correcta:
          'Where is the bathroom?',

        explicacion:
          '"Where is..." se utiliza para preguntar la ubicación de algo.'
      },


      {
        tipo:
          'traduccion',

        instruccion:
          '¿Qué significa esta frase?',

        pregunta:
          'How do I get to the hotel?',

        frase_ingles:
          'How do I get to the hotel?',

        frase_traduccion:
          '¿Cómo llego al hotel?',

        opciones: [
          '¿Cómo llego al hotel?',
          '¿Cuánto cuesta el hotel?',
          '¿Dónde está mi habitación?'
        ],

        respuesta_correcta:
          '¿Cómo llego al hotel?',

        explicacion:
          '"How do I get to..." pregunta cómo llegar a un lugar.'
      },


      {
        tipo:
          'ordenar',

        instruccion:
          'Ordena las palabras',

        pregunta:
          'Forma correctamente la pregunta',

        frase_ingles:
          'Where is the train station?',

        frase_traduccion:
          '¿Dónde está la estación de tren?',

        opciones: [
          'Where',
          'is',
          'the',
          'train',
          'station?'
        ],

        respuesta_correcta:
          'Where is the train station?',

        explicacion:
          'La estructura es "Where is + lugar?".'
      },


      {
        tipo:
          'situacion',

        instruccion:
          'Estás perdido',

        pregunta:
          'Necesitas saber cómo llegar al hotel.',

        frase_ingles:
          'How do I get to the hotel?',

        frase_traduccion:
          '¿Cómo llego al hotel?',

        opciones: [
          'How do I get to the hotel?',
          'I would like a coffee.',
          'Nice to meet you.'
        ],

        respuesta_correcta:
          'How do I get to the hotel?',

        explicacion:
          'Esta frase te permite pedir indicaciones para llegar a un lugar.'
      },


      {
        tipo:
          'desafio',

        instruccion:
          '🏆 Desafío final',

        pregunta:
          'Estás perdido y necesitas encontrar la estación de tren.',

        frase_ingles:
          'Excuse me, where is the train station?',

        frase_traduccion:
          'Disculpe, ¿dónde está la estación de tren?',

        opciones: [
          'Excuse me, where is the train station?',
          'I would like a coffee.',
          'What is your name?'
        ],

        respuesta_correcta:
          'Excuse me, where is the train station?',

        explicacion:
          '"Excuse me" hace que la pregunta sea más educada.'
      }

    ],

    desafio: {

      titulo:
        '🏆 Desafío de direcciones',

      descripcion:
        'Pide indicaciones para encontrar un lugar.'
    }
  }

];


const cargarNivel2 = async () => {

  try {

    await conectarDB();


    // Solo afecta Nivel 2
    await Etapa.deleteMany({
      nivel: 2
    });


    await Etapa.insertMany(
      etapasNivel2
    );


    console.log(
      `Nivel 2 creado con ${etapasNivel2.length} etapas`
    );


    etapasNivel2.forEach(
      etapa => {

        console.log(
          `Etapa ${etapa.orden}: ${etapa.nombre} - ${etapa.frases.length} frases - ${etapa.ejercicios.length} ejercicios`
        );

      }
    );

  } catch (error) {

    console.error(
      'Error cargando Nivel 2:',
      error.message
    );

  } finally {

    await mongoose.connection.close();

  }
};


cargarNivel2();