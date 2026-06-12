import React, { useState, useEffect } from 'react';
import { getProducts, triggerScraping } from '../services/api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      setProducts(response.data || []);
      setError(null);
    } catch (err) {
      setError('Error al conectar con el microservicio de inventario.');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setLoading(true);
      setError(null);
      await triggerScraping(); 
      await fetchCatalog(); 
      alert('Sincronización exitosa. ¡Catálogo actualizado desde okwu.cl!');
    } catch (err) {
      setError('Fallo en el Scraping: Conexión interrumpida o estructura inesperada del JSON externo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  return (
    <div style={{ padding: '30px', fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '15px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#2C3E50' }}>Gestión de Inventario (eCommerce-X)</h2>
          <p style={{ margin: '5px 0 0 0', color: '#7F8C8D', fontSize: '14px' }}>Alimentado en tiempo real mediante Scraping automatizado</p>
        </div>
        <button 
          onClick={handleSync} 
          disabled={loading}
          style={{ background: '#27AE60', color: 'white', padding: '12px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', transition: '0.3s' }}
        >
          {loading ? '🔄 Sincronizando...' : '🔄 Sincronizar Catálogo (Shopify)'}
        </button>
      </div>

      {error && (
        <div style={{ background: '#FDEDEC', color: '#C0392B', padding: '15px', borderRadius: '6px', marginBottom: '20px', borderLeft: '5px solid #E74C3C' }}>
          <strong>⚠️ Nota del Sistema:</strong> {error}
        </div>
      )}

      {loading && products.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#7F8C8D', marginTop: '40px' }}>Consultando base de datos centralizada...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '25px' }}>
          {products.map((prod, index) => (
            <div key={index} style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'between' }}>
              <img 
                src={prod.url_imagen || 'https://via.placeholder.com/150'} 
                alt={prod.nombre} 
                style={{ width: '100%', height: '160px', objectFit: 'contain', marginBottom: '15px' }} 
              />
              <h4 style={{ margin: '0 0 10px 0', color: '#2D3748', fontSize: '16px', height: '40px', overflow: 'hidden' }}>{prod.nombre}</h4>
              
              <div style={{ margin: 'auto 0 15px 0' }}>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#1A202C' }}>${prod.precio_regular}</span>
                {prod.precio_oferta && (
                  <p style={{ color: '#E53E3E', fontSize: '13px', margin: '2px 0 0 0', fontWeight: '500' }}>Oferta: ${prod.precio_oferta}</p>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '50px', background: prod.stock > 0 ? '#DEF7EC' : '#FDE8E8', color: prod.stock > 0 ? '#03543F' : '#9B1C1C' }}>
                  {prod.stock > 0 ? `Stock: ${prod.stock} u.` : 'Sin Stock'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}