const { Router } = require('express')
const { get_preguntas, create_pregunta } = require('../db/preguntas.js')
const { get_jugadas, create_jugada } = require('../db/jugadas.js')

const router = Router()

// Vamos a crear un middleware para ver si el usuario está logueado o no
function protected_route (req, res, next) {
  if (!req.session.user) {
    req.flash('errors', 'Debe loguearse primero')
    return res.redirect('/login')
  }
  // si llegamos hasta acá, guardamos el usuario de la sesión en una variable de los templates
  res.locals.user = req.session.user;
  // finalmente, seguimos el camino original
  next()
}


router.get('/', protected_route, (req, res) => {
  res.render('index.html')
})

router.get('/new_question', protected_route, (req, res) => {
  res.render('new_question.html')
})

router.post('/new_question', protected_route, async (req, res) => {
  console.log('req.body', req.body);
  const pregunta = req.body.pregunta
  const respuesta_correcta = req.body.respuesta_correcta,
        falsa1 = req.body.respuesta_falsa1,
        falsa2 = req.body.respuesta_falsa2,
        falsa3 = req.body.respuesta_falsa3,
        falsa4 = req.body.respuesta_falsa4;
  await create_pregunta(pregunta, respuesta_correcta, falsa1, falsa2, falsa3, falsa4)
  
  res.redirect('/')
})

router.get('/lets_play', protected_route, async(req, res) => {
  let preguntas = await get_preguntas(),
      respuestas = await mostrarRespuesta(),
      obj = {
        respuesta: [
          respuestas.res[0],
          respuestas.res[1],
          respuestas.res[2]]
      }
      console.log(respuestas.res[2][0].text);
  res.render('lets_play.html', obj)
})
async function mostrarRespuesta (){
  let preguntas = await get_preguntas()
  preguntas[0].respuestas = [
    {
      value: 'correcta',
      text: preguntas[0].respuesta_correcta
    },
    {
      value: 'incorrecta',
      text: preguntas[0].respuesta_falsa1
    },
    {
      value: 'incorrecta',
      text: preguntas[0].respuesta_falsa2
    },
    {
      value: 'incorrecta',
      text: preguntas[0].respuesta_falsa3
    },
    {
      value: 'incorrecta',
      text: preguntas[0].respuesta_falsa4
    },
  ]
  preguntas[0].respuestas = preguntas[0].respuestas.sort( (elem1, elem2) => Math.random() - 0.5)
  //
  preguntas[1].respuestas = [
    {
      value: 'correcta',
      text: preguntas[1].respuesta_correcta
    },
    {
      value: 'incorrecta',
      text: preguntas[1].respuesta_falsa1
    },
    {
      value: 'incorrecta',
      text: preguntas[1].respuesta_falsa2
    },
    {
      value: 'incorrecta',
      text: preguntas[1].respuesta_falsa3
    },
    {
      value: 'incorrecta',
      text: preguntas[1].respuesta_falsa4
    },
  ]
  preguntas[1].respuestas = preguntas[1].respuestas.sort( (elem1, elem2) => Math.random() - 0.5)
  //
  preguntas[2].respuestas = [
    {
      value: 'correcta',
      text: preguntas[2].respuesta_correcta
    },
    {
      value: 'incorrecta',
      text: preguntas[2].respuesta_falsa1
    },
    {
      value: 'incorrecta',
      text: preguntas[2].respuesta_falsa2
    },
    {
      value: 'incorrecta',
      text: preguntas[2].respuesta_falsa3
    },
    {
      value: 'incorrecta',
      text: preguntas[2].respuesta_falsa4
    },
  ]
  preguntas[2].respuestas = preguntas[2].respuestas.sort( (elem1, elem2) => Math.random() - 0.5)
  console.log(preguntas[0].respuestas,preguntas[1].respuestas,preguntas[2].respuestas);
  return respuesta = {
    res: [preguntas[0].respuestas,
          preguntas[1].respuestas,
          preguntas[2].respuestas]
  }
}

router.get('*', (req, res) => {
  res.render('404.html')
})

module.exports = router;