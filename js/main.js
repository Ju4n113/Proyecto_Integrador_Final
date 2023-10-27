// Declaración de un arreglo para almacenar los productos.
let productos = [];

// Realizar una solicitud fetch para obtener datos de un archivo JSON.
fetch("./js/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    })

// Obtención de referencias a elementos HTML por su ID o clase.
const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");

// Función para cargar los productos en la página.
function cargarProductos(productosElegidos) {
    contenedorProductos.innerHTML = ""; // Limpiar el contenedor de productos.

    productosElegidos.forEach(producto => {
        // Crear elementos HTML para mostrar los productos.
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
                <button class="producto-detail" id="${producto.id}">Detalles</button>
            </div>
        `;

        // Agregar un controlador de eventos para mostrar detalles del producto.
        const botonDetalles = div.querySelector(".producto-detail");
        botonDetalles.addEventListener("click", () => {
            mostrarDetallesProducto(producto);
        });

        // Agregar el producto al contenedor.
        contenedorProductos.append(div);
    })

    actualizarBotonesAgregar(); // Actualizar botones de "Agregar al carrito".
}

// Asignar controladores de eventos a los botones de categoría.
botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        // Desmarcar todos los botones de categoría y marcar el botón seleccionado.
        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id != "todos") {
            // Filtrar productos por categoría y mostrar los productos correspondientes.
            const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id);
            tituloPrincipal.innerText = productoCategoria.categoria.nombre;
            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            cargarProductos(productosBoton);
        } else {
            // Mostrar todos los productos.
            tituloPrincipal.innerText = "Todos los productos";
            cargarProductos(productos);
        }
    })
});

// Función para actualizar los controladores de eventos de los botones "Agregar al carrito".
function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

// Declaración de un arreglo para almacenar productos en el carrito de compras.
let productosEnCarrito;

// Obtener datos del carrito de compras almacenados en el almacenamiento local.
let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito(); // Actualizar el contador del carrito.
} else {
    productosEnCarrito = [];
}

// Función para agregar un producto al carrito de compras.
function agregarAlCarrito(e) {
    // Mostrar una notificación usando la librería Toastify.
    Toastify({
        text: "Producto agregado",
        duration: 3000,
        close: true,
        gravity: "top", // Posición de la notificación
        position: "right", // Posición de la notificación
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #464444, #6eaf69)",
            textTransform: "uppercase",
            fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem',
            y: '1.5rem'
        },
        onClick: function(){} // Función de devolución de llamada después de hacer clic en la notificación
    }).showToast();

    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if(productosEnCarrito.some(producto => producto.id === idBoton)) {
        // Si el producto ya está en el carrito, aumentar la cantidad.
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        // Si es un nuevo producto, establecer la cantidad en 1 y agregarlo al carrito.
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }

    actualizarNumerito(); // Actualizar el contador del carrito.

    // Almacenar los datos del carrito en el almacenamiento local.
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

// Función para actualizar el contador de productos en el carrito.
function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}

// Función para mostrar detalles de un producto en una ventana emergente.
function mostrarDetallesProducto(producto) {
    const ventanaDetalles = window.open('', 'ventanaDetalles', 'width=600,height=400');
    
    ventanaDetalles.document.write(`
        <html>
        <head>
            <title>Detalles del Producto</title>
            <link rel="stylesheet" href="./css/style.css">
        </head>
        <body>
            <div class="encasing">
                <header class "encabezado-superior">
                    <h2 class="logo">JMRshop</h2>
                    <header class="main">
                        <h2>Detalles del Producto</h2>
                    </header>
                    <h1 class="producto-titulo">${producto.titulo}</h1>
                    <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                    <p>$${producto.precio}</p>
                    <p>Descripción: ${producto.detalles.descripcion}</p>
                    <p>Características:</p>
                    <header>
                        <ul>
                            ${producto.detalles.caracteristicas.map(caracteristica => `<li>${caracteristica}</li>`).join('')}
                        </ul>
                    </header>
                </header>
            </div>
        </body>
        </html>
    `);
}
