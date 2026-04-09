const containerUser = document.getElementById("user");

function displayUserInfo() {
  if (!containerUser) return;

  const userData = JSON.parse(localStorage.getItem("neoUser"));
  const historial =
    JSON.parse(localStorage.getItem("historialPresupuestos")) || [];

  if (userData) {
    containerUser.innerHTML = `
        <img src="https://res.cloudinary.com/deppiblrq/image/upload/v1775691889/unnamed_c1xxsg.png" alt="User Profile">
        <div class="detailUser">
          <h2>${userData.nombre}</h2>
          <p>Usuario De CoreNova</p>
          <div class="cantPres">
            <h4>Presupuestos</h4>
            <p class="cant">${historial.length}</p>
          </div>
        </div>
      `;
  } else {
    containerUser.innerHTML = `<h3>Bienvenido, invitado</h3>`;
  }
}

document.addEventListener("DOMContentLoaded", displayUserInfo);
const containerPres = document.getElementById("presupuestos");

function displayHistorial() {
  if (!containerPres) return;

  const historial =
    JSON.parse(localStorage.getItem("historialPresupuestos")) || [];
  containerPres.innerHTML = "";

  if (historial.length === 0) {
    containerPres.innerHTML = `<p class="laletrachica">NO HAY REGISTROS EN EL NÚCLEO DE DATOS</p>`;
    return;
  }

  historial.forEach((presupuesto, index) => {
    const card = document.createElement("div");
    card.className = "presupuesto-card";

    const cantComponentes = presupuesto.items ? presupuesto.items.length : 0;

    card.innerHTML = `
      <div class="pres-icon">
        <i class="bi bi-cpu"></i>
      </div>
      <div class="pres-info">
        <h3>${presupuesto.proyecto}</h3>
        <div class="pres-meta">
          <span><i class="bi bi-calendar3"></i> ${presupuesto.fecha}</span>
          <span><i class="bi bi-layers"></i> ${cantComponentes} Componentes</span>
        </div>
      </div>
      <div class="pres-price">
        $${presupuesto.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </div>
      <div class="pres-actions">
        <button class="delete-pres" onclick="eliminarPresupuesto(${index})">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `;
    containerPres.appendChild(card);
  });
}

function eliminarPresupuesto(index) {
  let historial =
    JSON.parse(localStorage.getItem("historialPresupuestos")) || [];
  historial.splice(index, 1);
  localStorage.setItem("historialPresupuestos", JSON.stringify(historial));
  displayHistorial();
  displayUserInfo();
}

document.addEventListener("DOMContentLoaded", () => {
  displayUserInfo();
  displayHistorial();
});
