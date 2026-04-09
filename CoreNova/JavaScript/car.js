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
    <button id="exportarPDF" class="SaveP"><i class="bi bi-filetype-pdf"></i> EXPORTAR PDF</button>
    <p class="laletrachica">Cotización válida por 48 horas. Precios sujetos a disponibilidad de stock.</p>
  `;
  let btnExportar = document.getElementById("exportarPDF");
  if (btnExportar) {
    btnExportar.addEventListener("click", () => {
      if (array.length > 0) {
        if (array.length === 8) {
          imprimirFactura();
        } else {
          Swal.fire({
            title: "CONFIGURACIÓN INCOMPLETA",
            text: "El sistema requiere más componentes para validar la compatibilidad y finalizar el armado.",
            icon: "info",
            background: "#111827",
            color: "#ffffff",
            iconColor: "#00ffff",
            confirmButtonText: "CONTINUAR ARMADO",
            confirmButtonColor: "#007bff",

            customClass: {
              popup: "neon-border-alert",
              title: "font-header-alert",
              htmlContainer: "font-body-alert",
            },

            backdrop: `rgba(11, 15, 25, 0.7)`,
          });
        }
      } else {
        Swal.fire({
          title: "SISTEMA DE CONTROL",
          text: "Agrega componentes para exportar el presupuesto.",
          icon: "warning",
          background: "#111827",
          color: "#ffffff",
          iconColor: "#ff3e3e",
          confirmButtonText: "ACEPTAR",
          confirmButtonColor: "#007bff",
          customClass: {
            popup: "neon-border-alert",
            title: "font-header-alert",
            htmlContainer: "font-body-alert",
          },
        });
      }
    });
  }

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
function imprimirFactura() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const user = JSON.parse(localStorage.getItem("neoUser")) || {
    nombre: "INVITADO",
    email: "S/D",
  };

  doc.setFillColor(18, 18, 18);
  doc.rect(0, 0, 210, 40, "F");

  doc.setTextColor(0, 123, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("CORENOVA", 20, 25);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text("SISTEMA DE COTIZACIÓN TÉCNICA", 20, 32);

  doc.setTextColor(100, 100, 100);
  doc.setFontSize(12);
  doc.text("DETALLES DEL OPERADOR:", 20, 55);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text(`Nombre: ${user.nombre}`, 20, 65);
  doc.text(`Email: ${user.email}`, 20, 72);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 150, 65);

  doc.setDrawColor(200, 200, 200);
  doc.line(20, 80, 190, 80);

  doc.setFont("helvetica", "bold");
  doc.text("PRODUCTO", 20, 90);
  doc.text("PRECIO", 160, 90);
  doc.line(20, 95, 190, 95);

  doc.setFont("helvetica", "normal");
  let y = 105;

  carArray.forEach((item) => {
    doc.text(`${item.brand} ${item.model}`, 20, y);
    doc.text(`$${item.price.toLocaleString()}`, 160, y);
    y += 10;
  });

  const subtotal = carArray.reduce((acc, item) => acc + item.price, 0);
  const iva = subtotal * 0.16;
  const total = subtotal + 100 + iva;

  doc.line(20, y, 190, y);
  doc.setFontSize(11);
  doc.text(`SUBTOTAL: $${subtotal.toLocaleString()}`, 140, y + 15);
  doc.text(`ENSAMBLADO: $100`, 140, y + 22);

  doc.setFontSize(14);
  doc.setTextColor(0, 123, 255);
  doc.text(`TOTAL: $${total.toLocaleString()}`, 140, y + 35);

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    "Documento digital generado por el sistema CoreNova.",
    105,
    285,
    null,
    null,
    "center",
  );

  doc.save(`Factura_CoreNova_${user.nombre}.pdf`);
}
