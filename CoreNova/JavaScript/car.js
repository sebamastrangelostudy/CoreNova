const containerCar = document.getElementById("componentsCar");
const containerResume = document.getElementById("priceCar");
const carfetch = localStorage.getItem("carrito");
let carArray = JSON.parse(carfetch) || [];
const btnClear = document.getElementById("btnClean");
const modal = document.getElementById("modalForm");
const btnClose = document.getElementById("closeModal");
const btnConfirm = document.getElementById("confirmSave");
const loginModal = document.getElementById("login");
const btnLogin = document.getElementById("confirmLogin");

function verificarUsuario() {
  const userSaved = localStorage.getItem("neoUser");
  const historial =
    JSON.parse(localStorage.getItem("historialPresupuestos")) || [];

  if (!userSaved) {
    loginModal.classList.add("modal-active");
  } else {
    loginModal.classList.remove("modal-active");
    const user = JSON.parse(userSaved);
    const displayNombre = document.getElementById("displayNombre");
    const numPres = document.getElementById("numPres");

    if (displayNombre) displayNombre.innerText = user.nombre;
    if (numPres) numPres.innerText = historial.length;
  }
}

function displayCar(array) {
  containerCar.innerHTML = "";
  if (array.length === 0) {
    containerCar.innerHTML = "<h3>Tu carrito está vacío</h3>";
    return;
  }

  array.forEach((component, index) => {
    let componentNewCar = document.createElement("div");
    const tagsHTML = component.tags
      .map((tag) => `<span class="tag-badge">${tag}</span>`)
      .join("");

    componentNewCar.className = "productCar";
    componentNewCar.innerHTML = `
          <div class="item-car">
            <div class="component">
                <img class="img-component" src="${component.image}"/>
                <div class="texts-component">
                    <h2>${component.brand}/ ${component.model}</h2>
                    <div class="container-tags">${tagsHTML}</div>
                </div>
            </div>
             <h3 class="price-component">$${component.price}</h3>
             <div class="container-count">
                 <button class="btnCount">-</button>
                 <span>${component.quantity || 1}</span>
                 <button class="btnCount">+</button>
             </div>
             <button id="eliminarCar${index}" class="eliminarCar"><i class="bi bi-trash"></i></button>
        </div>
    `;
    containerCar.appendChild(componentNewCar);

    document
      .getElementById(`eliminarCar${index}`)
      .addEventListener("click", () => {
        array.splice(index, 1);
        localStorage.setItem("carrito", JSON.stringify(array));
        displayCar(array);
        displayResume(array);
      });
  });
}

function displayResume(array) {
  const subtotalBruto = array.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0,
  );
  const costoEnsamblado = array.length > 0 ? 100 : 0;
  const iva = (subtotalBruto + costoEnsamblado) * 0.16;
  const total = subtotalBruto + costoEnsamblado + iva;

  containerResume.innerHTML = `
    <h3 class="finalResume">Resumen <span>Final</span></h3>
    <div class="container-price-res">
        <div class="container-prices">
            <p>Subtotal Bruto</p>
            <h4>$${subtotalBruto.toLocaleString()}</h4>
        </div>
        <div class="container-prices">
            <p>Ensamblado</p>
            <h4>$${costoEnsamblado}</h4>
        </div>
        <div class="container-prices">
            <p>Impuestos (IVA 16%)</p>
            <h4>$${iva.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
        </div>
    </div>
    <div class="container-finalPrice">
        <h3>TOTAL GENERAL</h3>
        <div class="container-efectivo">
            <p>Precio Especial Efectivo</p>
            <h2>$${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
        </div>
    </div>
    <button id="addP" class="SaveP"><i class="bi bi-filetype-pdf"></i> EXPORTAR PDF</button>
    <p class="laletrachica">Cotización válida por 48 horas. Precios sujetos a disponibilidad de stock.</p>
  `;

  document.getElementById("addP").addEventListener("click", () => {
    if (carArray.length > 0) {
      modal.classList.add("modal-active");
    }
  });
}

btnLogin.addEventListener("click", () => {
  const nombre = document.getElementById("loginName").value;
  const email = document.getElementById("loginEmail").value;

  if (nombre && email) {
    const userData = { nombre: nombre.toUpperCase(), email: email };
    localStorage.setItem("neoUser", JSON.stringify(userData));
    verificarUsuario();
  }
});

btnClear.addEventListener("click", () => {
  localStorage.removeItem("carrito");
  carArray = [];
  displayCar(carArray);
  displayResume(carArray);
});

btnClose.addEventListener("click", () => {
  modal.classList.remove("modal-active");
});

btnConfirm.addEventListener("click", () => {
  const nombrePresupuesto = document.getElementById("presName").value;
  const notas = document.getElementById("userNotes").value;
  const user = JSON.parse(localStorage.getItem("neoUser"));

  if (nombrePresupuesto && user) {
    const subtotalBruto = carArray.reduce(
      (acc, item) => acc + item.price * (item.quantity || 1),
      0,
    );
    const costoEnsamblado = 100;
    const iva = (subtotalBruto + costoEnsamblado) * 0.16;
    const totalFinal = subtotalBruto + costoEnsamblado + iva;

    const presupuestoCompleto = {
      cliente: user.nombre,
      proyecto: nombrePresupuesto.toUpperCase(),
      detalles: notas,
      items: [...carArray],
      total: totalFinal,
      fecha: new Date().toLocaleDateString(),
    };

    const historial =
      JSON.parse(localStorage.getItem("historialPresupuestos")) || [];
    historial.push(presupuestoCompleto);
    localStorage.setItem("historialPresupuestos", JSON.stringify(historial));

    localStorage.removeItem("carrito");
    carArray = [];
    modal.classList.remove("modal-active");
    displayCar(carArray);
    displayResume(carArray);
    verificarUsuario();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  verificarUsuario();
  displayCar(carArray);
  displayResume(carArray);
});
