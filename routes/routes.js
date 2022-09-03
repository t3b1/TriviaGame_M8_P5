const { Router } = require('express')
const { get_preguntas, create_pregunta } = require('../db/preguntas.js')
const { get_jugadas} = require('../db/jugadas.js'),
      { evaluar_jugada } = require('../funciones/funtion.js')


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


router.get('/', protected_route, async (req, res) => {
  const verjugada = await get_jugadas()
  console.log(verjugada);
  res.render('index.html' ,{verjugada})
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
  let preguntas = await get_preguntas();
  mostrarRespuesta(preguntas)
  console.dir(preguntas[2].respuestas);

  res.render('lets_play.html', {preguntas})
})
router.post('/lets_play', protected_route, async (req, res) => {

  const respuesta1 = req.body.respuesta1,
        respuesta2 = req.body.respuesta2,
        respuesta3 = req.body.respuesta3,
        user_id = req.session.user.id  
  evaluar_jugada(respuesta1, respuesta2, respuesta3,user_id)
  res.render('index.html')
})

async function mostrarRespuesta (preguntas){
  for (let i=0;i<preguntas.length;i++){
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
    preguntas[i].respuestas = preguntas[i].respuestas.sort( (elem1, elem2) => Math.random() - 0.5)
  }
}

router.get('*', (req, res) => {
  res.render('404.html')
})

module.exports = router;