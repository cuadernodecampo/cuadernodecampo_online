const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://cuadernodecampo.up.railway.app";

window.iniciarSesion = async function () {
  const DNI = document.getElementById('DNI').value.trim();
  const contrasena = document.getElementById('contrasena').value.trim();

  if (!DNI || !contrasena) {
    alert("Debes completar todos los campos.");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ DNI, contrasena })
    });

    if (res.redirected) {
      window.location.href = res.url;
    } else {
      const errorText = await res.text();
      alert(errorText);
    }
  } catch (err) {
    alert("Error de conexión con el servidor.");
    console.error(err);
  }
}
