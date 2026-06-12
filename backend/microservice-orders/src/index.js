const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

const pedidos = [
    { id: 1, cliente: "Carlos Valenzuela", total: 19990, estado: "Validado" },
    { id: 2, cliente: "Ana María Muñoz", total: 24990, estado: "Facturado" }
];

app.get("/", (req, res) => {
    res.json({ status: "Microservicio de Pedidos Operativo" });
});

app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    if (email === "admin@ecommerce.com" && password === "admin123") {
        return res.json({
            status: "success",
            user: { email, role: "administrator" },
            token: "token-ficticio-jwt-ecommerce-x"
        });
    }
    return res.status(401).json({ status: "error", message: "Credenciales inválidas" });
});

app.get("/api/pedidos", (req, res) => {
    res.json({ status: "success", data: pedidos });
});

app.post("/api/pedidos", (req, res) => {
    const { cliente, total } = req.body;
    if (!cliente || !total) {
        return res.status(400).json({ status: "error", message: "Faltan datos requeridos" });
    }
    const nuevoPedido = { id: pedidos.length + 1, cliente, total, estado: "Validado" };
    pedidos.push(nuevoPedido);
    res.status(201).json({ status: "success", data: nuevoPedido });
});

app.listen(PORT, () => {
    console.log(`Microservicio de Pedidos corriendo en http://localhost:\${PORT}`);
});
