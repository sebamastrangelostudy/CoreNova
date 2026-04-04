function displayCatalogoIndex(array) {
  componentProdI.innerHTML = "";
  for (let component of array) {
    let componentI = document.createElement("div");
    componentI.className = "producto";
    componentI.setAttribute("data-id", component.id);
    componentI.innerHTML = `
     <article class="catalog__card">
                <p class="product__card-textcategory">${component.category}</p>
                <img src="${component.image}" alt="${component.model}" class="catalog__card-img" />
                <h3 class="catalog__card-title">${component.brand} ${component.model}</h3>
    </article>
        `;
    componentProdI.appendChild(componentI);
  }
}

displayCatalogoIndex(catalogo);


const productContainer = document.getElementById('product-container');

const renderCatalog = (items) => {
    productContainer.innerHTML = items.map(product => `
        <article class="catalog__card">
            <p class="product__card-textcategory">${product.category}</p>
            <img src="${product.img}" alt="${product.alt}" class="catalog__card-img" />
            <h3 class="catalog__card-title">${product.title}</h3>
        </article>
    `).join('');
};

renderCatalog(products);