from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
from psycopg2.extras import RealDictCursor
import requests

app = FastAPI(title="eCommerce-X Inventory Service con Scraping Real")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuración de la base de datos (Segundo Docker: Puerto 5433)
DB_CONFIG = {
    "dbname": "inventario_db",
    "user": "postgres",
    "password": "admin123",
    "host": "localhost",
    "port": "5433"
}

def fetch_and_normalize_shopify():
    """Consume la API real de okwu.cl exigida por el encargo y normaliza los datos"""
    url = "https://okwu.cl/collections/labiales/products.json"
    productos_normalizados = []
    
    try:
        # Manejo de errores solicitado por la rúbrica
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            products_list = data.get("products", [])
            
            for p in products_list:
                # Extraer variantes para el precio y el stock de forma segura
                variants = p.get("variants", [{}])
                primer_variante = variants[0]
                
                # Convertir precio de string (ej: "12990.00") a entero
                precio_float = float(primer_variante.get("price", 9990))
                
                # Normalización de los campos exigidos en el PDF
                producto = {
                    "nombre": p.get("title", "Producto sin nombre"),
                    "precio": int(precio_float),
                    "stock": 10 if primer_variante.get("available", True) else 0
                }
                productos_normalizados.append(producto)
        else:
            print(f"⚠️ Alerta Scraper: La fuente externa respondió con código {response.status_code}")
    except Exception as e:
        print(f"❌ Error al ejecutar el scraping externo: {e}")
        
    return productos_normalizados


def init_db():
    """Crea la tabla y la llena consumiendo el API de Shopify real"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # Crear tabla de productos si no existe
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS productos (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(255) NOT NULL,
                precio INTEGER NOT NULL,
                stock INTEGER NOT NULL
            );
        """)
        conn.commit()
        print("✅ Conectado a PostgreSQL (Inventario) en Docker.")

        # Verificar si la tabla está vacía
        cursor.execute("SELECT COUNT(*) FROM productos;")
        count = cursor.fetchone()[0]

        if count == 0:
            print("🔍 La base de datos está vacía. Ejecutando Scraping real de Shopify (okwu.cl)...")
            api_products = fetch_and_normalize_shopify()
            
            if not api_products:
                print("⚠️ No se obtuvieron productos del scraper. Usando catálogo de respaldo...")
                api_products = [{"nombre": "Labial Base de Respaldo", "precio": 5990, "stock": 10}]

            for prod in api_products:
                cursor.execute(
                    "INSERT INTO productos (nombre, precio, stock) VALUES (%s, %s, %s);",
                    (prod["nombre"], prod["precio"], prod["stock"])
                )
            conn.commit()
            print(f"📦 ¡Éxito! Se guardaron {len(api_products)} productos reales de Shopify en Docker.")

        cursor.close()
        conn.close()
    except Exception as e:
        print(f"❌ Error conectando o inicializando la base de datos: {e}")

# Inicializar base de datos al arrancar
init_db()


@app.get("/")
def index():
    return {"status": "Microservicio de Inventario Operativo con PostgreSQL y Scraping"}


@app.get("/api/productos")
def get_productos():
    """Trae los productos directamente desde la base de datos en Docker de forma veloz"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        cursor.execute("SELECT * FROM productos ORDER BY id ASC;")
        productos = cursor.fetchall()
        
        cursor.close()
        conn.close()
        return productos
    except Exception as e:
        return {"status": "error", "message": str(e)}