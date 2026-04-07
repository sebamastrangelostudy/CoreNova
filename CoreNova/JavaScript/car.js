const containerCar = document.getElementById("componentsCar");
const containerResume = document.getElementById("priceCar");
const carfetch = localStorage.getItem("carrito");
const carArray = JSON.parse(carfetch);

console.log(carArray);
function displayCar(array) {
  containerCar.innerHTML = "";
  for (let component of array) {
    let componentNewCar = document.createElement("div");
    const tagsHTML = component.tags
      .map((tag) => `<span class="tag-badge">${tag}</span>`)
      .join("");
    componentNewCar.className = "productCar";
    componentNewCar.setAttribute("data-id", component.id);
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
                 <button id="restBtn${component.id}"class="btnCount">-</button>
                 <span>1</span>
                    <button id="restBtn${component.id}"class="btnCount">+</button>
             </div>
             <button id="eliminarCar${component.id}" class="eliminarCar"><i class="bi bi-trash"></i></button>
       </div>
    `;
    containerCar.appendChild(componentNewCar);

    let btnEliminar = document.getElementById(`eliminarCar${component.id}`);
    btnEliminar.addEventListener("click", () => {
      componentNewCar.remove();
      let posicion = array.indexOf(component);
      if (posicion !== -1) {
        array.splice(posicion, 1);
      }
      localStorage.setItem("carrito", JSON.stringify(array));

      displayResume(array);

      if (array.length === 0) {
        containerCar.innerHTML = "<h3>Tu carrito está vacío</h3>";
      }
    });
  }
}

displayCar(carArray);

function displayResume(array) {
  const subtotalBruto = array.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0,
  );
  const costoEnsamblado = 100;
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
    <button class="SaveP"><i class="bi bi-floppy"></i> GUARDAR PRESUPUESTO</button>
    <p class="laletrachica">Cotización válida por 48 horas. Precios sujetos a disponibilidad de stock.</p>
  `;
}
displayResume(carArray);
