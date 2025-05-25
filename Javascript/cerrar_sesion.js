document.getElementById("BotonCerrarSesion").addEventListener("click", async () => {
  try {
    const res = await fetch("/login/logout", {
      method: "GET",
      credentials: "include",
    });

    // Redirigir al index una vez cerrada la sesión
    if (res.redirected) {
      window.location.href = res.url;
    } else {
      window.location.href = "/index.html";
    }
  } catch (err) {
    console.error("Error al cerrar sesión:", err);
    alert("Error al cerrar sesión.");
  }
});
