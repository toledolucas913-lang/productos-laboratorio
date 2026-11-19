const ruta = '/api/productos';

const mostrar = (id, texto) => {
    document.getElementById(id).textContent = texto;
};

// Función para enviar peticiones al servidor
async function enviar(metodo, producto = null) {

    document.querySelectorAll('button').forEach(b => {
        b.disabled = true;
    });

    mostrar('peticion', metodo + ' ' + ruta);

    mostrar(
        'enviado',
        producto === null
            ? 'Sin cuerpo: este GET no envía JSON.'
            : JSON.stringify(producto, null, 2)
    );

    mostrar('estado', 'Esperando respuesta...');
    mostrar('respuesta', '—');

    try {

        const opciones = {
            method: metodo
        };

        if (producto !== null) {

            opciones.headers = {
                'Content-Type': 'application/json'
            };

            opciones.body = JSON.stringify(producto);
        }

        const respuesta = await fetch(ruta, opciones);

        const datos = await respuesta.json();

        if (!respuesta.ok) {

            mostrar('estado', 'Error HTTP ' + respuesta.status);

            mostrar(
                'respuesta',
                datos.error || 'Los datos enviados no son válidos.'
            );

            return;
        }

        mostrar(
            'estado',
            'HTTP ' + respuesta.status +
            ' - Operación exitosa'
        );

        mostrar('respuesta', JSON.stringify(datos, null, 2));

        // Actualizar tabla y total de stock cuando se consulta con GET
        if (metodo === 'GET') {

            const tabla = document.getElementById('productos');

            tabla.replaceChildren();

            datos.forEach(producto => {

                const fila = document.createElement('tr');

                [
                    producto.id,
                    producto.nombre,
                    producto.precio,
                    producto.stock
                ].forEach(valor => {

                    const celda = document.createElement('td');

                    celda.textContent = valor;

                    fila.appendChild(celda);
                });

                tabla.appendChild(fila);
            });

            // Consultar el total de unidades de todos los productos
            const respuestaTotal = await fetch(ruta + '/stock-total');
            const total = await respuestaTotal.json();
            document.getElementById('stock-total').textContent = total;
        }

        if (metodo === 'POST') {

            document.getElementById('formulario').reset();

        }

    } catch (error) {

        mostrar(
            'estado',
            'No se pudo conectar con el servidor.'
        );

        mostrar('respuesta', error.message);

    } finally {

        document.querySelectorAll('button').forEach(b => {
            b.disabled = false;
        });
    }
}

// Botón para consultar productos
document.getElementById('consultar')
    .addEventListener('click', () => {
        enviar('GET');
    });

// Formulario para agregar productos
document.getElementById('formulario')
    .addEventListener('submit', evento => {

        evento.preventDefault();

        const valorPrecio =
            document.getElementById('precio').value;

        const valorStock =
            document.getElementById('stock').value;

        const producto = {

            nombre: document.getElementById('nombre').value,

            precio: valorPrecio === ''
                ? null
                : Number(valorPrecio),

            stock: valorStock === ''
                ? null
                : Number(valorStock)
        };

        enviar('POST', producto);
    });