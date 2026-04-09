const componentProdI = document.getElementById("containerProd-i");

fetch("products.json")
  .then((res) => res.json())
  .then((catalogo) => {
    const oneForCategory = Object.values(
      catalogo.reduce((acc, component) => {
        if (!acc[component.category]) {
          acc[component.category] = component;
        }

        return acc;
      }, {}),
    );

    oneForCategory.forEach((component) => {
      const card = document.createElement("article");
      card.className = "catalog__card";
      card.setAttribute("data-id", component.id);

      card.innerHTML = `
        <p class="product__card-textcategory">${component.category}</p>
        <img src="${component.image}" alt="${component.brand} ${component.model}"class="catalog__card-img" />
        <h3 class="catalog__card-title">${component.brand} ${component.model}
        </h3>
        <a href="../CoreNova/pages/catalogo.html" class="catalog__card-btn">Ver más</a>
      `;

      componentProdI.appendChild(card);
    });
  })
  .catch((err) => console.error("Error al cargar productos:", err));
