import axios from 'axios';

// Conexión al Microservicio de Inventario (Python - FastAPI)
export const inventoryApi = axios.create({
  baseURL: 'http://localhost:8081', 
  headers: { 'Content-Type': 'application/json' }
});

// Conexión al Microservicio de Órdenes (Node.js - Express)
// Nota: Si en tu backend configuraste otro puerto para Express (como el 8080 o 5000), cámbialo aquí.
export const ordersApi = axios.create({
  baseURL: 'http://localhost:3000', 
  headers: { 'Content-Type': 'application/json' }
});

// --- FUNCIONES DEL INVENTARIO (Python) ---
export const getProducts = () => inventoryApi.get('/api/productos');
export const triggerScraping = () => inventoryApi.post('/api/productos/scrape'); 

// --- FUNCIONES DE PEDIDOS Y AUTENTICACIÓN (Node.js) ---
export const loginUser = (credentials) => ordersApi.post('/auth/login', credentials);
export const getOrders = () => ordersApi.get('/orders');
export const createOrder = (orderData) => ordersApi.post('/orders', orderData);
export const deleteOrder = (id) => ordersApi.delete(`/orders/${id}`);