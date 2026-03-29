const containerComponents = document.getElementById("container-products");

class componentes {
  constructor(id, brand, model, category, price, tags, image) {
    ((this.id = id),
      (this.brand = brand),
      (this.model = model),
      (this.category = category),
      (this.price = price),
      (this.tags = tags),
      (this.image = image));
  }
}

let catalogo = [];
const storageGuardado = localStorage.getItem("catalogo");

if (storageGuardado) {
  const datos = JSON.parse(storageGuardado);
  catalogo = datos.map(
    (cmp) =>
      new componentes(
        cmp.id,
        cmp.brand,
        cmp.model,
        cmp.category,
        cmp.price,
        cmp.tags,
        cmp.image,
      ),
  );
} else {
  fetch("../products.JSON")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item) => {
        const newCmp = new componentes(
          item.id,
          item.brand,
          item.model,
          item.category,
          item.price,
          item.tags,
          item.image,
        );
        catalogo.push(newCmp);
      });

      localStorage.setItem("catalogo", JSON.stringify(catalogo));
    })
    .catch((error) => console.error("Error cargando el JSON:", error));
}
function mostrarCatalogoDOM(array) {
  containerComponents.innerHTML = "";
  for (let component of array) {
    let componentNuevoDiv = document.createElement("div");
    const tagsHTML = component.tags
      .map((tag) => `<span class="tag-badge">${tag}</span>`)
      .join("");
    componentNuevoDiv.className = "producto";
    componentNuevoDiv.setAttribute("data-id", component.id);
    componentNuevoDiv.innerHTML = `
     <div class="container-box-main">
               <img class="img-components" src="${component.image}"/>
               <div class="components-text">
               <p>${component.category}/${component.brand}<p/>
                <h2 class="title-box">${component.brand} ${component.model}</h2> 
                <div class="container-tags">
                    ${tagsHTML}
                 </div>
                      <h3 class="precio-box-1">$${component.price}</span></h3>
                <button id="agregarBtn${component.id}"class="btn btn--primary btn--add ">
                    <span class="material-symbols-outlined">
                        add_task
                    </span> Agregar al Presupuesto
                </button>
            </div>
        `;
    containerComponents.appendChild(componentNuevoDiv);
  }
}
console.log(catalogo);
mostrarCatalogoDOM(catalogo);
