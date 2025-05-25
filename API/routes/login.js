const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");

const router = express.Router();

// Endpoint para iniciar sesión
router.post("/", async (req, res) => {
  try {
    const { DNI, contrasena } = req.body;
    if (!DNI || !contrasena) {
      return res.status(400).send("Faltan campos");
    }

    const sqlUsuario = "SELECT * FROM usuario WHERE DNI = ?";
    db.query(sqlUsuario, [DNI], async (err, result) => {
      if (err) {
        console.error("Error en SELECT usuario:", err);
        return res.status(500).send("Error en servidor");
      }

      if (result.length === 0) {
        return res.status(401).send("Usuario no encontrado");
      }

      const usuario = result[0];

      db.query("SELECT * FROM ingeniero WHERE Usuario_DNI = ?", [DNI], async (err2, ingenieroRes) => {
        if (err2) {
          console.error("Error en SELECT ingeniero:", err2);
          return res.status(500).send("Error en servidor");
        }

        if (ingenieroRes.length === 0) {
          return res.status(403).send("No tienes permisos de ingeniero");
        }

        const match = await bcrypt.compare(contrasena, usuario.Password);
        if (!match) {
          return res.status(401).send("Contraseña incorrecta");
        }

        // Guardar sesión
        req.session.ingeniero = {
          dni: usuario.DNI,
          nombre: usuario.Nombre,
        };

        return res.redirect("/inicio_administrador.html");
      });
    });
  } catch (err) {
    console.error("Error inesperado en /login:", err);
    res.status(500).send("Error inesperado");
  }
});


// Endpoint para cerrar sesión
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/index.html");
  });
});

module.exports = router;
