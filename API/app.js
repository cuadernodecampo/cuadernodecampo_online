const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./config");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const app = express();
app.disable("x-powered-by"); // deshabilitar el header X-Powered-By: Express

//CONFIGURACION
app.set("PORT", config.app.PORT);

//RUTAS
const productos_y_usos = require("./routes/productos_y_usos");
const subirJsonRouter = require("./routes/subir_json");
const agricultoresRouter = require("./routes/agricultores");
const asesoresRouter = require("./routes/asesores");
const explotacionesRouter = require("./routes/explotaciones");
const parcelasRouter = require("./routes/parcelas");
const recintosRouter = require("./routes/recintos");
const cultivosRouter = require("./routes/cultivos");
const equiposRouter = require("./routes/equipos");
const tratamientosRouter = require("./routes/tratamientos");
const informesRouter = require("./routes/informes");
const loginRouter = require("./routes/login");

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "80mb" })); // Aumentar el límite de tamaño del cuerpo a 80mb
app.use(bodyParser.urlencoded({ extended: true, limit: "80mb" }));

// Manejo de sesiones
const cookieSecure = process.env.NODE_ENV === "localhost" ? false : true;

app.use(
  session({
    key: "cuaderno_sesion_id",
    secret: "super_secreto_seguro",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // activa solo con HTTPS
      sameSite: "lax", // para evitar bloqueos
    },
  })
);

// Proteger archivos privados
const htmlPrivadoDir = path.join(__dirname, "..", "HTML_privado");

fs.readdirSync(htmlPrivadoDir).forEach((archivo) => {
  if (archivo.endsWith(".html")) {
    const ruta = "/" + archivo;

    app.get(ruta, (req, res) => {
      if (!req.session?.ingeniero) {
        return res.redirect("/login.html");
      }
      res.sendFile(path.join(htmlPrivadoDir, archivo));
    });
  }
});

// Ruta para automatizar JSON de productos y usos
app.use("/productos_y_usos", productos_y_usos);

// Ruta para subir JSON de productos y usos
app.use("/subir-json", subirJsonRouter);

// Ruta para funcionalidades agricultores
app.use("/agricultores", agricultoresRouter);

// Ruta para funcionalidades asesores
app.use("/asesores", asesoresRouter);

// Ruta para funcionalidades explotacines
app.use("/explotaciones", explotacionesRouter);

// Ruta para funcionalidades parcelas
app.use("/parcelas", parcelasRouter);

// Ruta para funcionalidades recintos
app.use("/recintos", recintosRouter);

// Ruta para funcionalidades cultivos
app.use("/cultivos", cultivosRouter);

// Ruta para funcionalidades equipos
app.use("/equipos", equiposRouter);

// Ruta para funcionalidades tratamientos
app.use("/tratamientos", tratamientosRouter);

// Ruta para funcinalidades informes
app.use("/informes", informesRouter);

// Ruta para funcionalidades login
app.use("/login", loginRouter);

// RAILWAY
// Servir frontend estático
app.use("/", express.static(path.join(__dirname, "..", "HTML_publico")));
app.use("/css", express.static(path.join(__dirname, "..", "CSS")));
app.use("/js", express.static(path.join(__dirname, "..", "Javascript")));
app.use("/fotos", express.static(path.join(__dirname, "..", "Fotos")));
app.use("/data", express.static(path.join(__dirname, "..", "Data")));

module.exports = app;
