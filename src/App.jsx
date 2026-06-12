import React, { useState } from 'react';
import Products from './views/Products';
import Orders from './views/Orders';

export default function App() {
  const [currentView, setCurrentView] = useState('inventory'); 

  return (
    <div style={{ minHeight: '100vh', background: '#F7FAFC' }}>
      {/* Barra de Navegación Profesional */}
      <nav style={{ background: '#1A202C', padding: '0 30px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: '#3182CE', width: '12px', height: '12px', borderRadius: '50%' }}></div>
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', letterSpacing: '0.5px' }}>eCommerce-X Control Center</span>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setCurrentView('inventory')} 
            style={{ 
              background: currentView === 'inventory' ? '#2D3748' : 'transparent', 
              color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', transition: '0.2s' 
            }}
          >
            📦 Catálogo e Inventario (Python)
          </button>
          <button 
            onClick={() => setCurrentView('orders')} 
            style={{ 
              background: currentView === 'orders' ? '#2D3748' : 'transparent', 
              color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', transition: '0.2s' 
            }}
          >
            🛒 Gestión de Órdenes (Node.js)
          </button>
        </div>
      </nav>

      {/* Contenedor Dinámico de Vistas */}
      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {currentView === 'inventory' ? <Products /> : <Orders />}
      </main>
    </div>
  );
}