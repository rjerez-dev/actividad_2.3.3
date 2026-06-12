import React, { useState, useEffect } from 'react';
import { getOrders, createOrder, deleteOrder } from '../services/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [cliente, setCliente] = useState('');
  const [total, setTotal] = useState('');

  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error("Error al conectar con el servicio de órdenes.");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!cliente || !total) return;

    try {
      const nuevoPedido = {
        cliente,
        total: parseFloat(total),
        estado: 'Procesando',
        fecha: new Date().toLocaleDateString()
      };
      await createOrder(nuevoPedido);
      setCliente('');
      setTotal('');
      fetchOrders(); 
    } catch (err) {
      alert("Error al procesar el pedido. Intente nuevamente.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de que desea cancelar y eliminar este pedido?")) {
      try {
        await deleteOrder(id);
        fetchOrders();
      } catch (err) {
        alert("No se pudo eliminar el pedido.");
      }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div style={{ padding: '30px', fontFamily: 'Segoe UI, sans-serif' }}>
      <h2 style={{ color: '#2C3E50', marginBottom: '5px' }}>Procesamiento de Pedidos</h2>
      <p style={{ color: '#7F8C8D', fontSize: '14px', marginTop: 0, marginBottom: '25px' }}>Módulo crítico conectado al Backend en Node.js [cite: 36]</p>

      {/* Formulario de Alta */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '30px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#4A5568' }}>Registrar Nuevo Pedido</h3>
        <form onSubmit={handleCreate} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="Nombre completo del cliente" 
            value={cliente} 
            onChange={e => setCliente(e.target.value)} 
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #CBD5E0', flex: '2', minWidth: '200px' }} 
          />
          <input 
            type="number" 
            placeholder="Monto Total ($)" 
            value={total} 
            onChange={e => setTotal(e.target.value)} 
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #CBD5E0', flex: '1', minWidth: '120px' }} 
          />
          <button type="submit" style={{ background: '#2B6CB0', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            Validar y Facturar
          </button>
        </form>
      </div>

      {/* Tabla de Resultados */}
      <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#EDF2F7', color: '#4A5568', fontSize: '14px' }}>
              <th style={{ padding: '15px' }}>ID de Pedido</th>
              <th style={{ padding: '15px' }}>Cliente</th>
              <th style={{ padding: '15px' }}>Fecha</th>
              <th style={{ padding: '15px' }}>Total</th>
              <th style={{ padding: '15px' }}>Estado de Distribución</th>
              <th style={{ padding: '15px', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#A0AEC0' }}>No hay pedidos registrados en el sistema de colas.</td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid #E2E8F0', fontSize: '15px' }}>
                  <td style={{ padding: '15px', fontWeight: 'bold', color: '#4A5568' }}>#000{order.id}</td>
                  <td style={{ padding: '15px', color: '#2D3748' }}>{order.cliente}</td>
                  <td style={{ padding: '15px', color: '#718096' }}>{order.fecha || 'Hoy'}</td>
                  <td style={{ padding: '15px', fontWeight: '600', color: '#2D3748' }}>${order.total}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#D69E2E', fontWeight: '600', fontSize: '14px' }}>
                      ● {order.estado}
                    </span>
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <button 
                      onClick={() => handleDelete(order.id)} 
                      style={{ background: '#E53E3E', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
                    >
                      Cancelar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}