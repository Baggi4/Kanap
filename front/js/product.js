/*localhost:3000/api/products/*/
/*Modifier l'url de l'API*/
const param = new URLSearchParams(document.location.search);
let id = param.get("id");
// console.log(id);
/*Appeler l'API*/
const fetchProduct = async () => {
  let fetchDataProduct = await fetch(
    `http://localhost:3000/api/products/${id}`
  );
  let productData = await fetchDataProduct.json();
  return productData;
};
fetchProduct();
// console.log(fetchProduct());
/*Insérer l'API*/
const itemsKanap = async () => {
  let canapeProductView = await fetchProduct();
  console.log(canapeProductView);
  let itemImg = document.querySelector(".item__img");
  let title = document.getElementById("title");
  let price = document.getElementById("price");
  let description = document.getElementById("description");
  itemImg.innerHTML += `<img src="${canapeProductView.imageUrl}" alt=${canapeProductView.altTxt} />`;
  title.innerHTML += `<h1 id="title">${canapeProductView.name}</h1>`;
  price.innerHTML += `${canapeProductView.price}`;
  description.innerHTML += `${canapeProductView.description}`;
  color(canapeProductView.colors);
};
itemsKanap();
/*Insérer les couleurs*/
const color = (colors) => {
  let option = document.getElementById("colors");
  for (let color of colors) {
    option.innerHTML += `<option value="${color}">${color}</option>`;
  }
};
/*Enregistrer le/les choix de l'utilisateur*/
let btn = document.getElementById("addToCart");
btn.addEventListener("click", () => {
  let color = document.getElementById("colors").value;
  let quantity = Number(document.getElementById("quantity").value);
  let itemImg = document.querySelector(".item__img img").src;
  let title = document.getElementById("title").innerText;

  /*L'alerter en cas d'erreur de saisie*/
  if (!color) {
    alert("Choisissez une couleur !");
    return;
  }
  if (!(quantity > 0 && quantity < 101)) {
    alert("Choisissez une quantité !");
    return;
  }
  /*Sauvegarder dans le local storage*/
  let informations = {
    id,
    color,
    quantity,
    itemImg,
    title,
  };
  console.log(informations);
  /*Convert Json <=> JS */
  let saveProduct = JSON.parse(localStorage.getItem("product"));
  if (!saveProduct) {
    saveProduct = [];
    saveProduct.push(informations);
  } else {
    for (let h = 0; h < saveProduct.length; h++) {
      if (saveProduct[h].id == id && saveProduct[h].color == color) {
        saveProduct[h].quantity += quantity;
        localStorage.setItem("product", JSON.stringify(saveProduct));
        return;
      }
    }
    saveProduct.push(informations);
  }
  localStorage.setItem("product", JSON.stringify(saveProduct));
});
