/*Appeler l'API*/
const fetchCanape = async () => {
  let fetchData = await fetch("http://localhost:3000/api/products");
  let productCanape = await fetchData.json();
  return productCanape;
};
/* Insérer l'API*/
const canapeView = async () => {
  let canapeProduct = await fetchCanape();
  // console.log(canapeProduct);
  let items = document.getElementById("items");
  for (let i = 0; i < canapeProduct.length; i += 1) {
    items.innerHTML += `<a href="product.html?id=${canapeProduct[i]._id}"> <article> <img src="${canapeProduct[i].imageUrl}" alt="${canapeProduct[i].altTxt}" /> <h3 class="productName">${canapeProduct[i].name}</h3> <p class="productDescription">${canapeProduct[i].description}</p> </article> </a>`;
  }
};
canapeView();
