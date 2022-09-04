const alertList = document.querySelectorAll('.alert')
const alerts = [...alertList].map(element => new bootstrap.Alert(element))


// let boton_enviar = document.querySelector('.btn_enviar')
// let div_mensaje = document.querySelector('.mensaje')
// if(boton_enviar != null){
//     boton_enviar.addEventListener("click", function (){
//         div_mensaje.removeAttribute('hidden', false)
//     })
// }
// console.log('ok');
// $(document).ready(function() {
//     $('#oculto').show();
//   });

