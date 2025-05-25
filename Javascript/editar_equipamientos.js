const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://cuadernodecampo.up.railway.app";

const inputBusquedaEquipo = document.getElementById("busqueda-equipo");
const selectEquipos = document.getElementById("seleccion-equipo");

const nombreInput = document.getElementById("nombre-equipo-tratamiento");
const romaInput = document.getElementById("numero_roma");
const fechaAdqInput = document.getElementById("fecha_adquisicion");
const fechaRevInput = document.getElementById("fecha_ultima_inspeccion");

let equipos = [];

// Cargar equipos al iniciar
window.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch(`${API_URL}/equipos`);
        equipos = await res.json();
        cargarSelect(equipos);
    } catch (err) {
        console.error("Error al cargar equipos:", err);
    }
});

// Función para cargar el select con equipos
function cargarSelect(lista) {
    selectEquipos.innerHTML = `
        <option value="" disabled selected>Seleccione el equipo</option>
    `;
    lista.forEach(eq => {
        const option = document.createElement("option");
        option.value = eq.Numero_ROMA;
        option.textContent = `${eq.Nombre} | ${eq.Numero_ROMA}`;
        selectEquipos.appendChild(option);
    });
}

// Filtrado por texto
inputBusquedaEquipo.addEventListener("input", () => {
    const texto = inputBusquedaEquipo.value.trim().toLowerCase();
    if (!equipos || equipos.length === 0) return;

    const filtradas = equipos.filter((equipo) =>
        `${equipo.Nombre} | ${equipo.Numero_ROMA}`.toLowerCase().includes(texto)
    );

    cargarSelect(filtradas);
});

// Mostrar datos al seleccionar equipo
selectEquipos.addEventListener("change", () => {
    const seleccionado = equipos.find(eq => eq.Numero_ROMA == selectEquipos.value);
    if (seleccionado) {
        nombreInput.value = seleccionado.Nombre;
        romaInput.value = seleccionado.Numero_ROMA;
        fechaAdqInput.value = seleccionado.Fecha_adquisicion.split("T")[0]; // formato YYYY-MM-DD
        fechaRevInput.value = seleccionado.Fecha_ultima_revision.split("T")[0];

         // Habilitamos los campos para edición
         nombreInput.removeAttribute("readonly");
         fechaAdqInput.removeAttribute("readonly");
         fechaRevInput.removeAttribute("readonly");
    }
});



// Actualizar datos del equipo
document.getElementById("editar-equipamiento").addEventListener("click", async (e) => {
    e.preventDefault();

    const roma = romaInput.value;
    if (!roma) {
        alert("Selecciona un equipo para editar");
        return;
    }

    const confirmar = confirm("¿Estás seguro de que deseas actualizar los datos de este equipo?");
    if (!confirmar) return;

    // Recopilando los datos actualizados
    const payload = {
        nombre: nombreInput.value.trim(),
        fecha_adquisicion: fechaAdqInput.value,
        fecha_ultima_revision: fechaRevInput.value,
    };

    try {
        const res = await fetch(`${API_URL}/equipos/actualizar/${roma}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Error al actualizar");

        alert("Datos del equipo actualizados correctamente.");
        location.reload();
    } catch (err) {
        alert(`Error: ${err.message}`);
    }
});
