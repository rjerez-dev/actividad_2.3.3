from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# NOTA: Si da error, cambiamos la forma de importarlo aquí:
try:
    from app.services.scraper import fetch_and_normalize_products
except ModuleNotFoundError:
    from services.scraper import fetch_and_normalize_products

app = FastAPI(title="eCommerce-X Inventory Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def index():
    return {"status": "Microservicio de Inventario Operativo"}

@app.get("/api/productos")
def get_productos():
    return fetch_and_normalize_products()