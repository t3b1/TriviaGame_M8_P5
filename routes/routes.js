const { Router, text } = require('express')
const { get_preguntas, create_pregunta } = require('../db/preguntas.js')
const { get_jugadas } = require('../db/jugadas.js'),
  { evaluar_jugada } = require('../funciones/funtion.js')

const router = Router()

// Vamos a crear un middleware para ver si el usuario está logueado o no
function protected_route(req, res, next) {
  if (!req.session.user) {
    req.flash('errors', 'Debe loguearse primero')
    return res.redirect('/login')
  }
  // si llegamos hasta acá, guardamos el usuario de la sesión en una variable de los templates
  res.locals.user = req.session.user;
  // finalmente, seguimos el camino original
  next()
}

function protegerNewQuestion(req, res, next) {
  if (req.session.user.isadmin == false) {
    return res.redirect('/')
  }
  next()
}

let jugada
let ruta
let idJugador


router.get('/', protected_route, async (req, res) => {
  const nombre_usuario = req.session.user.name
  const id_usuario = req.session.user.id
  const jugadas = await get_jugadas()
  visibility = 'hidden'

  console.log(nombre_usuario,id_usuario,idJugador);
  if (ruta == 'lets_play') {
    if (idJugador == id_usuario) {
      visibility = 'visible'
    }
  }else{
    visibility = 'hidden'
  }

  res.render('index.html', { jugadas, jugada, visibility })
})

router.get('/new_question', protected_route, protegerNewQuestion, (req, res) => {
  ruta == 'new_question'
  res.render('new_question.html')
})

router.post('/new_question', protected_route, async (req, res) => {
  ruta == 'new_question'
  const pregunta = req.body.pregunta
  const respuesta_correcta = req.body.respuesta_correcta,
    falsa1 = req.body.respuesta_falsa1,
    falsa2 = req.body.respuesta_falsa2,
    falsa3 = req.body.respuesta_falsa3,
    falsa4 = req.body.respuesta_falsa4;
  await create_pregunta(pregunta, respuesta_correcta, falsa1, falsa2, falsa3, falsa4)
  res.redirect('/')
})

router.get('/lets_play', protected_route, async (req, res) => {
  let preguntas = await get_preguntas();
  mostrarRespuesta(preguntas)
  res.render('lets_play.html', { preguntas })
})
router.post('/lets_play', protected_route, async (req, res) => {
  ruta = 'lets_play'
  const respuesta1 = req.body.respuesta1,
    respuesta2 = req.body.respuesta2,
    respuesta3 = req.body.respuesta3,
    user_id = req.session.user.id
    jugada = await evaluar_jugada(respuesta1, respuesta2, respuesta3, user_id)
    idJugador= jugada.idjugador
    console.log(jugada);


  res.redirect('/')
})

async function mostrarRespuesta(preguntas) {
  for (let i = 0; i < preguntas.length; i++) {
    preguntas[i].respuestas = [
      {
        value: 'correcta',
        text: preguntas[i].respuesta_correcta
      },
      {
        value: 'incorrecta',
        text: preguntas[i].respuesta_falsa1
      },
      {
        value: 'incorrecta',
        text: preguntas[i].respuesta_falsa2
      },
      {
        value: 'incorrecta',
        text: preguntas[i].respuesta_falsa3
      },
      {
        value: 'incorrecta',
        text: preguntas[i].respuesta_falsa4
      },
    ]
    preguntas[i].respuestas = preguntas[i].respuestas.sort((elem1, elem2) => Math.random() - 0.5)
  }
}

router.get('*', (req, res) => {
  res.render('404.html')
})

module.exports = router;