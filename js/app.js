let cliente = {
    mesa:'',
    hora:'',
    pedido:[]
};

const btnGuardarCliente = document.querySelector('#guardar-cliente');
btnGuardarCliente.addEventListener('click',guardarCliente);

function guardarCliente(){
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    const camposVacios = [mesa, hora].some(campo => campo ==='');
    if(camposVacios){
        //verificar si ya hay una alerta 
        const ejAlerta = document.querySelector('.invalid-feedback');

        if(!ejAlerta){
            const alerta = document.createElement('div');
            alerta.classList.add('invalid-feedback','d-block','text-center');

            alerta.textContent = 'Todos los campos son obligatorios';

            document.querySelector('.modal-body form').appendChild(alerta);

            setTimeout(() => {
                alerta.remove();
            }, 3000);
        }
        return;   
    }
    //asignar datos del formulario a cliente
    cliente = {...cliente, mesa, hora};
    //console.log(cliente);

    //ocultar modal

    const modalFormulario = document.querySelector('#formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
    modalBootstrap.hide();
    //mostrar las secciones ocultas
    mostrarSecciones();
    //obtener platillos del json-server 
    obtenerPlatillos();

}

 function mostrarSecciones(){
    //querySelector cuando solo cuando la propiedad a manejar es unica y querySelectorAll cuando la funcion se aplica a varios 
    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach(seccion => seccion.classList.remove('d-none'));
    

 }

 function obtenerPlatillos(){
    const url = 'http://localhost:4000/platillos';
    
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => console.log(resultado))
        .catch(error => console.log(error))
 }