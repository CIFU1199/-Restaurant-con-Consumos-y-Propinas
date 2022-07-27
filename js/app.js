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
        //comprueba si el elemento existe en el array
        if(pedido.some(articulo => articulo.id === producto.id)){
                //el articulo ya existe, solo debemos actualizar la cantidad
            const pedidoActualizado = pedido.map(articulo =>{
                if(articulo.id === producto.id){
                    articulo.cantidad = producto.cantidad;
                }
                return articulo;
                // se asigna el nuevo array a cliente.pedido
            });
            cliente.pedido =[...pedidoActualizado];
        }else{
            // el articulo no existe lo agregamos al array de pedido
            cliente.pedido = [...pedido, producto]; 
        }
    }else{
        //eliminar elementos cuando la cantidad es 0
        const resultado = pedido.filter(articulo => articulo.id !== producto.id);
        cliente.pedido =[...resultado];
    }
    limpiarHTML();
    actualizarResumen();
 }
 function actualizarResumen(){
    const contenido = document.querySelector('#resumen .contenido');
    const resumen = document.createElement('div');
    resumen.classList.add('col-md-6', 'card','py-5','px-3','shadow');
    // info de la mesa
    const mesa = document.createElement('p');
    mesa.textContent ='Mesa: ';
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('span');
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-bold');
    
    // info de la hora 
    const hora = document.createElement('p');
    hora.textContent ='Hora: ';
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('span');
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add('fw-bold');

    const heading = document.createElement('h3');
    heading.textContent =  'Platillos Consumidos';
    heading.classList.add('my-4', 'text-center');



    //agregar a los elementos padre 
    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);
    
    //iterar sobre el array de pedidos 
    const grupo = document.createElement('ul');
    grupo.classList.add('list-group');
    //Destructuring de Objeto
    const {pedido} = cliente;
    
    pedido.forEach(articulo =>{
        const {nombre ,  cantidad , precio ,id } = articulo;

        const lista = document.createElement('li');
        lista.classList.add('list-group-item');

        //nombre
        const nombreEL = document.createElement('h4');
        nombreEL.classList.add('my-4');
        nombreEL.textContent = nombre;

        //cantidad del articulo 
        const cantidadEL = document.createElement('p');
        cantidadEL.classList.add('fw-bold');
        cantidadEL.textContent = 'Cantidad: ';

        const CantidadValor = document.createElement('span');
        CantidadValor.classList.add('fw-normal');
        CantidadValor.textContent = cantidad;

        //agregar valores a sus contenedores 
        

        //Precio del articulo 

        const precioEL = document.createElement('p');
        precioEL.classList.add('fw-bold');
        precioEL.textContent = 'Precio: ';

        const precioValor = document.createElement('span');
        precioValor.classList.add('fw-normal');
        precioValor.textContent = `$${precio}`;
        
        ////agregar valores a sus contenedores
        cantidadEL.appendChild(CantidadValor);
        precioEL.appendChild(precioValor);

        //Agregar los elementos al LI
        lista.appendChild(nombreEL);
        lista.appendChild(cantidadEL);
        lista.appendChild(precioEL);
        //lista.appendChild(idEL);

        //agregar lista al grupo principal 
        grupo.appendChild(lista);

    })

    //agregar al contenido 
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(heading);
    resumen.appendChild(grupo);

    contenido.appendChild(resumen);

 }

 function limpiarHTML(){
    const contenido = document.querySelector('#resumen .contenido');
    while (contenido.firstChild) {
        contenido.removeChild(contenido.firstChild);
    }
}