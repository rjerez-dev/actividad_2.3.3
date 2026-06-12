console.log("¡SÍ, ESTOY EDITANDO EL ARCHIVO CORRECTO!");
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 8080;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'pedidos_db',
  password: 'admin123',
  port: 5432,
});

app.use(cors());
app.use(express.json());

const initDb = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS pedidos (
      id SERIAL PRIMARY KEY,
      cliente VARCHAR(255) NOT NULL,
      total INTEGER NOT NULL,
      estado VARCHAR(50) DEFAULT 'Validado',
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(createTableQuery);
    console.log("✅ Conectado a PostgreSQL en Docker. Tabla 'pedidos' lista.");
  } catch (err) {
    console.error("❌ Error al conectar con el Docker de Postgres:", err);
  }
};
initDb();

app.get('/', (req, res) => {
    res.json({ status: "Microservicio de Pedidos Operativo con PostgreSQL en Docker" });
});

app.get('/api/pedidos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pedidos ORDER BY id DESC');
        res.json({ status: "success", data: result.rows });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

app.post('/api/pedidos', async (req, res) => {
    const { cliente, total } = req.body;
    if (!cliente || !total) {
        return res.status(400).json({ status: "error", message: "Faltan datos requeridos" });
    }
    try {
        const query = 'INSERT INTO pedidos (cliente, total, estado) VALUES ($1, $2, $3) RETURNING *';
        const values = [cliente, total, 'Validado'];
        const result = await pool.query(query, values);
        res.status(201).json({ status: "success", data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (email === "admin@ecommerce.com" && password === "admin123") {
        return res.json({
            status: "success",
            user: { email, role: "administrator" },
            token: "token-ficticio-jwt"
        });
    }
    return res.status(401).json({ status: "error", message: "Credenciales inválidas" });
});

app.listen(PORT, () => {
    console.log(`Microservicio de Pedidos corriendo en http://localhost:${PORT}`);
});