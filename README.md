# Entrega 2 - WebSockets con Handlebars

Este proyecto implementa un sistema de productos en tiempo real utilizando WebSockets y Handlebars.

## Características

- **Vista Home**: Lista todos los productos sin funcionalidad de edición
- **Vista Real Time Products**: Permite agregar y eliminar productos en tiempo real usando WebSockets
- **Motor de plantillas**: Handlebars para renderizado del lado del servidor
- **WebSockets**: Socket.io para comunicación en tiempo real
- **Gestión de productos**: CRUD completo con persistencia en JSON

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Ejecutar el servidor:
```bash
npm start
```

3. Abrir en el navegador:
- Home: http://localhost:8080
- Productos en Tiempo Real: http://localhost:8080/realtimeproducts

## Estructura del Proyecto

```
src/
├── app.js                 # Servidor principal con Express y Socket.io
├── ProductManager.js      # Clase para gestión de productos
├── data/
│   └── products.json      # Archivo de datos de productos
├── routes/
│   └── views.router.js    # Rutas de vistas
└── views/
    ├── layouts/
    │   └── main.handlebars    # Layout principal
    ├── partials/
    │   ├── product-card.handlebars    # Tarjeta de producto
    │   └── product-form.handlebars    # Formulario de producto
    ├── home.handlebars        # Vista home
    └── realTimeProducts.handlebars    # Vista de productos en tiempo real
```

## Funcionalidades

### Vista Home (/)
- Muestra todos los productos disponibles
- Solo lectura, sin botones de edición

### Vista Real Time Products (/realtimeproducts)
- Formulario para agregar nuevos productos
- Lista de productos con botones de eliminación
- Actualización automática en tiempo real usando WebSockets
- Los cambios se reflejan inmediatamente en todos los clientes conectados

## Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **Socket.io** - Biblioteca para WebSockets
- **Handlebars** - Motor de plantillas
- **Bootstrap** - Framework CSS
- **Font Awesome** - Iconos
