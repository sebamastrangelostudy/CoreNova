const componentProdI = document.getElementById("containerProd-i");

fetch("products.json")
  .then(res => res.json())
  .then(catalogo => {
    catalogo.forEach(component => {
      const card = document.createElement("article");
      card.className = "catalog__card";
      card.setAttribute("data-id", component.id);

      card.innerHTML = `
        <p class="product__card-textcategory">${component.category}</p>
        <img src="${component.image}" alt="${component.brand} ${component.model}" class="catalog__card-img" />
        <h3 class="catalog__card-title">${component.brand} ${component.model}</h3>
      `;

      componentProdI.appendChild(card);
    });
  })
  .catch(err => console.error("Error al cargar productos:", err));