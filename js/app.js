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
    if(cliente.pedido.length){
        //mostrar resumen
        actualizarResumen();
    }else{
        mensajePedidoVacio();
    }

    
 }
 function actualizarResumen(){
    const contenido = document.querySelector('#resumen .contenido');
    const resumen = document.createElement('div');
    resumen.classList.add('col-md-6', 'card','py-2','px-3','shadow');
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

        //Precio del articulo 
        const precioEL = document.createElement('p');
        precioEL.classList.add('fw-bold');
        precioEL.textContent = 'Precio: ';

        const precioValor = document.createElement('span');
        precioValor.classList.add('fw-normal');
        precioValor.textContent = `$${precio}` ;

        //SubTotal del articulo 
        const SubTotalEL = document.createElement('p');
        SubTotalEL.classList.add('fw-bold');
        SubTotalEL.textContent = 'SubTotal: ';

        const SubTotalValor = document.createElement('span');
        SubTotalValor.classList.add('fw-normal');
        SubTotalValor.textContent = calcularSubtotal(precio, cantidad);
        
        //boton para eliminar 
        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn','btn-danger');
        btnEliminar.textContent = 'Eliminar!' 

        //funcion para eliminar el pedido
        btnEliminar.onclick = function (){
            eliminarProducto(id);
        }


        //agregar valores a sus contenedores
        cantidadEL.appendChild(CantidadValor);
        precioEL.appendChild(precioValor);
        SubTotalEL.appendChild(SubTotalValor);

        //Agregar los elementos al LI
        lista.appendChild(nombreEL);
        lista.appendChild(cantidadEL);
        lista.appendChild(precioEL);
        lista.appendChild(SubTotalEL);
        lista.appendChild(btnEliminar);
        //lista.appendChild(idEL);

        //agregar lista al grupo principal 
        grupo.appendChild(lista);

    })

    //agregar al contenido 
    resumen.appendChild(heading);
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(grupo);

    contenido.appendChild(resumen);

    //mostrar formulario de propinas 
    formularioPropinas();

 }

 function limpiarHTML(){
    const contenido = document.querySelector('#resumen .contenido');
    while (contenido.firstChild) {
        contenido.removeChild(contenido.firstChild);
    }
}

function calcularSubtotal( precio, cantidad){
    return `$ ${precio * cantidad}`;
}

function eliminarProducto(id){
    const {pedido} = cliente; 
    const resultado = pedido.filter(articulo => articulo.id !== id);
    cliente.pedido =[...resultado];

    limpiarHTML();
    if(cliente.pedido.length){
        //mostrar resumen
        actualizarResumen();
    }else{
        mensajePedidoVacio();
    }
    

    //El producto se elimino por lo tanto regresamos la cantidad a 0 en el formulario 
    const productoEliminado = `#Producto-${id}`
    const inputEliminado = document.querySelector(productoEliminado);
    inputEliminado.value = 0;
    
}

function mensajePedidoVacio() {
    const contenido = document.querySelector('#resumen .contenido');

    const texto = document.createElement('p');
    texto.classList.add('text-center');
    texto.textContent = 'Añade los elementos de pedido';

    contenido.appendChild(texto);
}

function formularioPropinas () {
   
    const contenido = document.querySelector('#resumen .contenido');
    const formulario = document.createElement('div');
    formulario.classList.add('col-md-6','formulario');

    const divFormulario = document.createElement('div');
    divFormulario.classList.add('card','py-2','px-3','shadow');

    const heading = document.createElement('h3');
    heading.classList.add('my-4','text-center');
    heading.textContent ='Propina';
    
    // radio button 10%
    const radio10 = document.createElement('input');
    radio10.type = 'radio';
    radio10.name = 'Propina';
    radio10.value = "10"; 
    radio10.classList.add('form-check-input');

    const radio10Label = document.createElement('label');
    radio10Label.textContent ='10%';
    radio10Label.classList.add('form-check-label');
    radio10.onclick= calcularPropina;

    const radio10Div = document.createElement('div');
    radio10Div.classList.add('form-check');

    radio10Div.appendChild(radio10);
    radio10Div.appendChild(radio10Label );

    // radio button 25%
    const radio25 = document.createElement('input');
    radio25.type = 'radio';
    radio25.name = 'Propina';
    radio25.value = "25"; 
    radio25.classList.add('form-check-input');
    radio25.onclick= calcularPropina;

    const radio25Label = document.createElement('label');
    radio25Label.textContent ='25%';
    radio25Label.classList.add('form-check-label');

    const radio25Div = document.createElement('div');
    radio25Div.classList.add('form-check');

    radio25Div.appendChild(radio25);
    radio25Div.appendChild(radio25Label );

    // radio button 50%
    const radio50 = document.createElement('input');
    radio50.type = 'radio';
    radio50.name = 'Propina';
    radio50.value = "50"; 
    radio50.classList.add('form-check-input');
    radio50.onclick= calcularPropina;

    const radio50Label = document.createElement('label');
    radio50Label.textContent ='50%';
    radio50Label.classList.add('form-check-label');

    const radio50Div = document.createElement('div');
    radio50Div.classList.add('form-check');

    radio50Div.appendChild(radio50);
    radio50Div.appendChild(radio50Label );

    //agregar al div principal 
    divFormulario.appendChild(heading);
    divFormulario.appendChild(radio10Div);
    divFormulario.appendChild(radio25Div);
    divFormulario.appendChild(radio50Div);

    //agregarlo al formulario 
    formulario.appendChild(divFormulario);
    
    contenido.appendChild(formulario);
}

function calcularPropina() {
    const { pedido }= cliente;
    let SubTotal = 0;

    //Calcular el subtotal a pagar 
    pedido.forEach(articulo => {
        SubTotal += articulo.cantidad * articulo.precio;
    });

    //seleccionar el radio button con la propina del cliente 
    const propinaSeleccionada = document.querySelector('[name="Propina"]:checked').value;
    
    //calcular la propina 
    const propina = ((SubTotal * parseInt(propinaSeleccionada))/100);
    
    
    //calcular el total a pagar 
    const total = ( SubTotal + propina);
    
   
    mostrarTotalHTML(SubTotal, total, propina);

}

function mostrarTotalHTML(SubTotal, total, propina){
    
    const divTotal = document.createElement('div');
    divTotal.classList.add('total-pagar','my-5');
    
    //subtotal
    const subtotalParrafo = document.createElement('p');
    subtotalParrafo.classList.add('fs-3','fw-bold','mt-2');
    subtotalParrafo.textContent = 'Subtotal Consumo: ';

    const subtotalSpan = document.createElement('span');
    subtotalSpan.classList.add('fw-normal');
    subtotalSpan.textContent = `$${SubTotal}`;

    subtotalParrafo.appendChild(subtotalSpan);
    

    //propina
    const propinaParrafo = document.createElement('p');
    propinaParrafo.classList.add('fs-3','fw-bold','mt-2');
    propinaParrafo.textContent = 'Propina: ';

    const propinaSpan = document.createElement('span');
    propinaSpan.classList.add('fw-normal');
    propinaSpan.textContent = `$ ${propina}`;
    
   
    propinaParrafo.appendChild(propinaSpan);

    //Total a pagar 
    const totalParrafo = document.createElement('p');
    totalParrafo.classList.add('fs-3','fw-bold','mt-2');
    totalParrafo.textContent = 'Total a Pagar: ';

    const totalSpan = document.createElement('span');
    totalSpan.classList.add('fw-normal');
    totalSpan.textContent = `$ ${total}`;
    
    //eliminar el ultimo resultado
    const totalPagarDiv = document.querySelector('.total-pagar');
    if(totalPagarDiv){
        totalPagarDiv.remove();
    }
   
    totalParrafo.appendChild(totalSpan);
    
    divTotal.appendChild(subtotalParrafo);
    divTotal.appendChild(propinaParrafo);
    divTotal.appendChild(totalParrafo);


    const formulario = document.querySelector('.formulario >div'  );
    formulario.appendChild(divTotal);

}