const mysql = require("mysql2");

// Conexión a MySQL con createPool (mejor manejo de conexiones)
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Exportar la conexión para usarla en otros módulos
module.exports = db;
