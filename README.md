# BACKEND

# Sistema de Comercio Electronico Distribuido - Ecommerce-X

Este proyecto consiste en una arquitectura de comercio electronico basada en microservicios desacoplados. El sistema gestiona de forma independiente el inventario de productos mediante un servicio en Python y el procesamiento de pedidos a traves de un servicio en Node.js, cada uno conectado a sus respectivas bases de datos persistentes.

## Arquitectura del Proyecto

El repositorio esta organizado de forma limpia y modular, separando las responsabilidades de cada componente del backend:

ecommerce-x/
├── backend/
│   ├── microservice-inventory/   # Microservicio de Inventario (Python)
│   │   ├── requirements.txt      # Dependencias del servicio Python
│   │   └── app/                  # Codigo fuente de la aplicacion
│   │       ├── main.py           # Punto de entrada de FastAPI
│   │       └── services/         # Logica de negocio y servicios internos
│   │           ├── main.py       # Persistencia y gestion de datos
│   │           ├── scraper.py    # Modulo de extraccion (Shopify Scraper)
│   │           └── __init__.py
│   │
│   └── microservice-orders/      # Microservicio de Ordenes (Node.js)
│       ├── index.js              # Punto de entrada de Express
│       ├── package.json          # Configuracion y dependencias de npm
│       ├── package-lock.json     # Bloqueo de versiones de dependencias
│       └── src/                  # Modulos internos y controladores del servicio
│
├── .gitignore                    # Exclusion de node_modules y archivos temporales
└── README.md                     # Documentacion general del sistema

## Componentes del Backend

### 1. Microservicio de Inventario (microservice-inventory)
Desarrollado en Python utilizando el framework FastAPI. Se encarga de la gestion del catalogo de productos y cuenta con un servicio especializado de scraping encargado de sincronizar y extraer datos de plataformas externas basadas en Shopify.
* Tecnologias: Python, FastAPI, Uvicorn.
* Punto de entrada: backend/microservice-inventory/app/main.py

### 2. Microservicio de Ordenes (microservice-orders)
Desarrollado en Node.js utilizando el framework Express. Se encarga de la logica de negocio asociada a la creacion, actualizacion y procesamiento de los pedidos de la plataforma, interactuando con su propio almacenamiento aislado.
* Tecnologias: Node.js, Express, pg (PostgreSQL client).
* Punto de entrada: backend/microservice-orders/index.js

## Requisitos Previos

Antes de inicializar los servicios, asegurese de contar con las siguientes herramientas instaladas en su entorno local:
* Python 3.12 o superior
* Node.js v18 o superior y npm
* Docker y Docker Compose (para las bases de datos correspondientes)

## Instrucciones de Instalacion y Despliegue

### Clonar el repositorio
Abra una terminal y ejecute el siguiente comando para clonar el proyecto:
git clone https://github.com/rjerez-dev/actividad_2.3.3.git
cd ecommerce-x

### Configuracion del Microservicio de Inventario
1. Navegue al directorio del servicio:
cd backend/microservice-inventory
2. Se recomienda crear un entorno virtual:
python -m venv venv
venv\Scripts\activate
3. Instale las dependencias requeridas:
pip install -r requirements.txt
4. Inicie el servidor de desarrollo:
uvicorn app.main:app --reload --port 8081

### Configuracion del Microservicio de Ordenes
1. Abra una nueva terminal y navegue al directorio del servicio:
cd backend/microservice-orders
2. Instale los paquetes de Node.js (la carpeta node_modules se creara localmente y esta excluida del repositorio mediante el archivo .gitignore):
npm install
3. Inicie el servidor de desarrollo:
node index.js

## Buenas Practicas de Desarrollo

* Control de Versiones: Las carpetas de dependencias como node_modules o los archivos temporales de compilacion de Python como __pycache__ se encuentran estrictamente ignorados en el archivo .gitignore para mantener la limpieza del repositorio.
* Desacoplamiento: Cada microservicio debe mantener su independencia logica y de datos, comunicandose unicamente a traves de los puntos de acceso API expuestos por sus respectivos servidores locales.
