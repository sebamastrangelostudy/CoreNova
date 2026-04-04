const containerComponents = document.getElementById("container-products");
const filterButtons = document.querySelectorAll(".button-filters");
const marcaButtons = document.querySelectorAll(".input-field");

function clearAllFilters() {
  filterButtons.forEach((btn) => {
    btn.classList.remove("com-active");
    btn.checked = false;
  });
  marcaButtons.forEach((btn) => {
    btn.classList.remove("marca-active");
    btn.checked = false;
  });
}

marcaButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const isActive = button.classList.contains("marca-active");

    clearAllFilters();

    if (isActive) {
      displayCatalogDOM(catalogo);
    } else {
      button.classList.add("marca-active");
      button.checked = true;

      const selectedMarca = button.name.toUpperCase();
      const filteredByMarca = catalogo.filter((item) =>
        item.brand.toUpperCase().includes(selectedMarca),
      );

      displayCatalogDOM(filteredByMarca);
    }
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const isActive = button.classList.contains("com-active");

    clearAllFilters();

    if (isActive) {
      displayCatalogDOM(catalogo);
    } else {
      button.classList.add("com-active");
      button.checked = true;

      const selectedCategory = button.innerText.toUpperCase();
      const filteredByCategory = catalogo.filter((item) =>
        item.category.toUpperCase().includes(selectedCategory),
      );

      displayCatalogDOM(filteredByCategory);
    }
  });
});
function displayCatalogDOM(dataArray) {
  containerComponents.innerHTML = "";

  dataArray.forEach((component) => {
    const productFilter = document.createElement("div");
    productFilter.className = "producto";
    productFilter.setAttribute("data-id", component.id);

    const tagsHTML = component.tags
      .map((tag) => `<span class="tag-badge">${tag}</span>`)
      .join("");

    productFilter.innerHTML = `
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
    containerComponents.appendChild(productFilter);
  });
}
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
function displayCatalogoDOM(array) {
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
displayCatalogoDOM(catalogo);


// const products = [
//     {
//         category: "PROCESADOR",
//         title: "CORE I9-14900K LGA1700",
//         img: "/src/assets/CORE i9.png",
//         alt: "CORE I9-14900K"
//     },
//     {
//         category: "TARJETA GRÁFICA",
//         title: "RTX 4090 PHANTOM",
//         img: "/src/assets/RTX.png",
//         alt: "RTX 4090 PHANTOM"
//     },
//     {
//         category: "MEMORIA RAM",
//         title: "DOMINATOR DDR5",
//         img: "/src/assets/DOMINATOR DDR5.png",
//         alt: "DOMINATOR DDR5"
//     },
//     {
//         category: "PLACA MADRE",
//         title: "Motherboard B550m Ds3h Gigabyte Amd Am4",
//         img: "/src/assets/pacaBase.jpeg",
//         alt: "Placas Base"
//     },
//     {
//         category: "FUENTE DE PODER",
//         title: "FUENTE GAMER SENTEY 850W 80 GOLD",
//         img: "/src/assets/fuente-gamerSentey850W.webp",
//         alt: "Fuentes de Poder"
//     }
// ];

// const productContainer = document.getElementById('product-container');

// const renderCatalog = (items) => {
//     productContainer.innerHTML = items.map(product => `
//         <article class="catalog__card">
//             <p class="product__card-textcategory">${product.category}</p>
//             <img src="${product.img}" alt="${product.alt}" class="catalog__card-img" />
//             <h3 class="catalog__card-title">${product.title}</h3>
//         </article>
//     `).join('');
// };

// renderCatalog(products);