const containerComponents = document.getElementById("container-products");
const filterButtons = document.querySelectorAll(".button-filters");
const marcaButtons = document.querySelectorAll(".input-field");
const searchbutton = document.getElementById("search");
const cDiv = document.getElementById("coincidencias");
const componentCarWidget = JSON.parse(localStorage.getItem("carrito")) ?? [];
const componentProdI = document.getElementById("containerProd-i");
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
      displayCatalogoDOM(catalogo);
    } else {
      button.classList.add("marca-active");
      button.checked = true;

      const selectedMarca = button.name.toUpperCase();
      const filteredByMarca = catalogo.filter((item) =>
        item.brand.toUpperCase().includes(selectedMarca),
      );

      displayCatalogoDOM(filteredByMarca);
    }
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const isActive = button.classList.contains("com-active");

    clearAllFilters();

    if (isActive) {
      displayCatalogoDOM(catalogo);
    } else {
      button.classList.add("com-active");
      button.checked = true;

      const selectedCategory = button.innerText.toUpperCase();
      const filteredByCategory = catalogo.filter((item) =>
        item.category.toUpperCase().includes(selectedCategory),
      );

      displayCatalogoDOM(filteredByCategory);
    }
  });
});

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
                <button id="agregarBtn${component.id}"class="btn-startquoting btn--add">
                    <span class="material-symbols-outlined">
                        add_task
                    </span> Agregar al Presupuesto
                </button>
            </div>
        `;
    containerComponents.appendChild(componentNuevoDiv);
    const addCarbtn = document.getElementById(`agregarBtn${component.id}`);
    addCarbtn.addEventListener("click", () => {
      addCar(component);
      disabledCategory();
    });
  }
}
displayCatalogoDOM(catalogo);
disabledCategory();

function disabledCategory() {
  const car = localStorage.getItem("carrito");
  console.log(car);
  const carArray = JSON.parse(car);
  const blockedCategories = carArray.map((item) => item.category.toUpperCase());
  const filteredCatalog = catalogo.filter((component) => {
    return !blockedCategories.includes(component.category.toUpperCase());
  });
  marcaButtons.forEach((button) => {
    button.classList.add("category-disabled");
    button.disabled = true;
  });
  displayCatalogoDOM(filteredCatalog);

  filterButtons.forEach((button) => {
    const btnText = button.innerText.toUpperCase();

    if (blockedCategories.includes(btnText)) {
      button.classList.add("category-disabled");
      button.disabled = true;
      button.classList.remove("com-active");
    }
  });
}

function addCar(item) {
  let cAdd = componentCarWidget.find(
    (component) =>
      component.category.toUpperCase() == item.category.toUpperCase(),
  );
  cAdd == undefined
    ? (componentCarWidget.push(item),
      Toastify({
        text: "Se ha Agregado tu Producto Al Carrito",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, #96c93d, #96c93d)",
        },
        onClick: function () {},
      }).showToast(),
      localStorage.setItem("carrito", JSON.stringify(componentCarWidget)),
      console.log(componentCarWidget))
    : Toastify({
        text: `Ya tienes un ${item.category} en el Carrito`,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, #ff0015, #ff0015)",
        },
        onClick: function () {},
      }).showToast();
  // if(item.category)
}
function searchComponent(b, array) {
  let c = array.filter((component) => {
    return (
      component.model.toUpperCase().includes(b.toUpperCase()) ||
      component.brand.toUpperCase().includes(b.toUpperCase())
    );
  });
  c.length > 0
    ? (displayCatalogoDOM(c), (cDiv.innerHTML = ""))
    : (displayCatalogoDOM(),
      (cDiv.innerHTML = `<h3>No hay coincidencias con su búsqueda, este es nuestro catálogo completo</h3>`));
}
searchbutton.addEventListener("input", () => {
  searchComponent(searchbutton.value, catalogo);
});
