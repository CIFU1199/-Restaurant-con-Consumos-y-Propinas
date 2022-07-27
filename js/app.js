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
        console.log('Si hay almenos un campo vacio');
    }else{
        console.log('Todos los campos estan llenos');
    }

}