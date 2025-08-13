// server.js
require('dotenv').config();
require('./utils/scheduler');

const express = require('express');
const app     = express();
const authR   = require('./routes/auth');
const userR    = require('./routes/users');
const productR = require('./routes/products');
const orderR      = require('./routes/orders');
const productionR = require('./routes/production');
const { authenticateToken } = require('./middleware/auth');
const mpR    = require('./routes/materiaPrima');
const movR   = require('./routes/movimientosInventario');
const txR      = require('./routes/transactions');
const reportR  = require('./routes/reports');
const alertR = require('./routes/alerts');
const dashR        = require('./routes/dashboard');


app.use(express.json());

// Rutas públicas de autenticación
app.use('/api/auth', authR);

// Rutas protegidas
app.use('/api/users',    userR);
app.use('/api/products', productR);
app.use('/api/orders',     authenticateToken, orderR);
app.use('/api/production', authenticateToken, productionR);
app.use('/api/materiaprima', mpR);
app.use('/api/movimientos',  movR);
app.use('/api/transactions', txR);
app.use('/api/reports',      reportR);
app.use('/api/alerts',       authenticateToken, alertR);
app.use('/api/dashboard', dashR);


// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    // Si el controlador lanzó un error con propiedad statusCode, la usamos
    const status = err.statusCode || 500;
    res.status(status).json({
        error: err.message || 'Error interno del servidor'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/api`);
});
