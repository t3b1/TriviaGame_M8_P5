const {create_jugada} = require('../db/jugadas.js')
async function evaluar_jugada (res1, res2,res3, user_id){
    let resultado = 0;
    let porcentaje = 0;
    if (res1 == 'correcta') {
      resultado++
    }
    if (res2 == 'correcta') {
      resultado++
    }
    if (res3 == 'correcta') {
      resultado++
    }
          
    porcentaje = ((resultado * 100) / 3).toFixed(1)
    
 const algo = await create_jugada(resultado, porcentaje, user_id)
 return algo
  }

module.exports = {evaluar_jugada}
  