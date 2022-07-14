/*Modifier l'url de l'API*/
const param = new URLSearchParams(document.location.search);
let id = param.get("id");
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


//-------------------Initialisation Class Produit-------------------//
//---------------------------------------------------------------------//
class ProductClass {
  constructor(id, name, color, qty) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.qty = qty;
  }
}

/*Enregistrer le/les choix de l'utilisateur*/
let btn = document.getElementById("addToCart");
btn.addEventListener("click", () => {
  console.log("test")
  let color = document.getElementById("colors").value;
  let quantity = Number(document.getElementById("quantity").value);
  let title = document.getElementById("title").innerText;
  let qtyChoosen = "";

  // Initialisation variable
  let ProductLocalStorage = [];
  let oldQty = 0;

  // Boucle for à la longueur du localStorage avec récuperation des informations du localstorage.
  for (let i = 0; i < localStorage.length; i++) {
    ProductLocalStorage[i] = JSON.parse(localStorage.getItem(localStorage.key(i)));
    // Conditionnel si Id est la même dans localstorage et dans notre Newproduct,
    // && que si la Color de notre Newproduct est strictement = à celle qui est dans le localstorage. 
    if (id === ProductLocalStorage[i].id && ProductLocalStorage[i].color === color) {
      oldQty = ProductLocalStorage[i].qty;
    }
  }

  // On Calcul notre nouvel quantité en prenant en compte l'ancienne valeur.
  qtyChoosen = parseInt(oldQty) + parseInt(quantity);
  // On définit le produit choisis en créant une nouvelle instance de ProductClass,
  // on inject les nouvelles valeurs dans notre Class.
  let informations = new ProductClass(
    id,
    title,
    color,
    qtyChoosen,
  );

  if (color != "" && quantity >= 1 && quantity <= 100) {

    localStorage.setItem(
      title + " " + color,
      JSON.stringify(informations)
    );

  } else {
    alert("Veuillez renseigner une couleur et une quantité entre 1 et 100.");
  }
});
