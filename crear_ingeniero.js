require("dotenv").config(); // ← Asegura la carga de variables de entorno

const bcrypt = require("bcrypt");
const db = require("API/db");

async function crearIngeniero() {
    const dni = "admin";
    const nombre = "Pepe";
    const apellido1 = "Mel";
    const apellido2 = "Betis";
    const contrasena = "nimda";
    const rol = "Admin";

    try {
        const hash = await bcrypt.hash(contrasena, 10);

        // Insertar en Usuario
        await db.promise().query(
            `INSERT INTO usuario (DNI, Nombre, Apellido1, Apellido2, Password, Rol)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [dni, nombre, apellido1, apellido2, hash, rol]
        );

        // Insertar en Ingeniero
        await db.promise().query(
            `INSERT INTO ingeniero (Usuario_DNI) VALUES (?)`,
            [dni]
        );

        console.log("Ingeniero creado correctamente.");
    } catch (err) {
        console.error("Error al crear el ingeniero:", err);
    } finally {
        process.exit();
    }
}

crearIngeniero();