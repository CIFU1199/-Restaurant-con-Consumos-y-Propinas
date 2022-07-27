let cliente = {
    mesa:'',
    hora:'',
    pedido:[]
};

const categorias ={
    1: 'Comida',
    2: 'Bebidas',
    3: 'Postres'
}

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
        .then(resultado => mostrarPlatillos(resultado))
        .catch(error => console.log(error))
 }

 function mostrarPlatillos(platillos){
    const contenido = document.querySelector('#platillos .contenido');
    platillos.forEach(platillo => {
        const row = document.createElement('div');
        row.classList.add('row','py-3','border-top');

        const nombre = document.createElement('div');
        nombre.classList.add('col-md-4');
        nombre.textContent = platillo.nombre;

        const precio = document.createElement('div');
        precio.classList.add('col-md-3','fw-bold');
        precio.textContent = `$ ${platillo.precio}`;
        
        const categoria = document.createElement('div');
        categoria.classList.add('col-md-3');
        categoria.textContent = categorias[platillo.categoria];

        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `Producto-${platillo.id}`; 
        inputCantidad.classList.add('form-control');

        //funcion que detecta la cantidad de platillos pedidos
        inputCantidad.onchange =  function () {
            const cantidad = parseInt (inputCantidad.value);
            agregarPlatillo({...platillo, cantidad});
        };
        
        const agregar = document.createElement('div');
        agregar.classList.add('col-md-2');
        agregar.appendChild(inputCantidad)

        row.appendChild(nombre);

        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(agregar);
        contenido.appendChild(row);
        
        //console.log(platillo); 
    });

    //console.log(platillos);

 }

 function agregarPlatillo(producto) {
    let { pedido } = cliente;

    if(producto.cantidad > 0){
        cliente.pedido = [...pedido.producto];        
    }else{
        console.log('No es mayor a 0');
    }

    console.log(cliente.pedido);
 }