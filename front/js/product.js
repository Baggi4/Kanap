//les varriables
const parametreUrl = new URLSearchParams(document.location.search); // renvoi les paramètres de l'url //            
const nameParams = parametreUrl.get("id"); // renvoi la valeur du parametre //     
const imagProd = document.createElement("img"); // creer un élément <img> //
const colorOption = document.getElementById("colors");
const btnAddToCart = document.getElementById("addToCart");

let productsInfo = [];
let colorProd = [];
let quantityValue = 0;
let colorSelected = "";

// Méthode fetch(read) recherche de données du produit // 
const fetchProducts = async () => {
  await fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then(
      (
        data // utilise id en paramettre pour retourner les infos du produits // 
      ) =>
        (productsInfo = data.filter((product) => {
          return product._id == nameParams;
        }))
    );
};
// Structure du DOM //
// renvoi image du produit //
const imgProduct = async () => {
  productsInfo.forEach((product) => {
    imagProd.setAttribute("src", product.imageUrl);
    imagProd.setAttribute("alt", product.altTxt);
    document.querySelector(".item__img").appendChild(imagProd);
  });
};

//renvoie le nom & le prix du produit //
const contentProducts = async () => {
  document.getElementById("title").textContent = productsInfo.map(
    (product) => (product = product.name)
  );

  document.getElementById("price").textContent = productsInfo.map(
    (product) => (product = product.price)
  );
};

// Renvoie la description du produit //
const descriptionProduct = async () => {
  document.getElementById("description").textContent = productsInfo.map(
    (product) => (product = product.description)
  );
};

// Options de couleurs du produits //
const colorProduct = async () => {
  colorProd = productsInfo.map((product) => (product = product.colors));
  colorProd.forEach((colors) => {
    colors.forEach((color) => {
      const newOption = document.createElement("option");
      newOption.setAttribute("value", color);
      newOption.textContent = color;
      colorOption.appendChild(newOption);
    });
  });
};

// call les Functions d'affichage // 
const productSelected = async () => {
  await fetchProducts();
  await imgProduct();
  await contentProducts();
  await descriptionProduct();
  await colorProduct();
};
productSelected();

// lire la valeur indiqué dans l'input de quantité et la remettre a 0 si la valeur et négative //
const quantity = document.getElementById("quantity");
quantity.addEventListener("change", (e) => {
  quantityValue = e.target.value;
  let quantityVerification = new RegExp("^[0-9]{1,2}$"); //Exp régulière
  if (!quantityVerification.test(quantityValue)) {
    quantity.value = 0; //remettre la valeur afficher a 0
    quantityValue = 0; //remettre la valeur a 0
  }
});

// lire l'option du couleur selectionné //
document
  .getElementById("colors")
  .setAttribute("onchange", "getSelectedValue()");
const getSelectedValue = () => {
  colorSelected = document.getElementById("colors").value;
};

// Confirmer l'ajout du produit au panier //
const toConfirm = () => {
  if (
    // Confirmation ajout article //
    confirm(
      "Votre article a bien été ajouter au panier!"
    )
  ) {
    document.location.href = "cart.html";
  } else {
    // ANNULER=>page d'acceuil pour continuer les achats //
    document.location.href = "index.html";
  }
};

// add un évènement au click //
btnAddToCart.addEventListener("click", () => {
  // Mess Alert si la couleur & quantité du produit ne sont pas renseignés //
  if (colorSelected === "" || quantityValue == 0) {
    alert("Merci de renseigner la couleur et la quantité souhaitée");
  } else {
    let product = {
      // créer un produit avec id quantité & couleur //
      id: nameParams,
      quantity: quantityValue,
      color: colorSelected,
    };
    let arrayProduct = JSON.parse(localStorage.getItem("produits"));
    //s'il ya deja des produits dans le localStorage je push(ajoute) d'autre objet a mon tableau //
    if (arrayProduct) {
      //si le id et la couleur existe déja dans notre tableau en incremente la quantité sinon en ajoute le produit //
      const getProduct = arrayProduct.find(
        (element) => element.id == product.id && element.color == product.color
      );
      if (getProduct) {
        getProduct.quantity =
          Number(getProduct.quantity) + Number(product.quantity);
        localStorage.setItem("produits", JSON.stringify(arrayProduct));
        toConfirm();
        quantity.value = 0;
        return;
      }
      arrayProduct.push(product);
      localStorage.setItem("produits", JSON.stringify(arrayProduct));
      console.log(arrayProduct);
      toConfirm();
      quantity.value = 0;
    }
    //sinon je créé un tableau & j'ajoute mon objet //
    else {
      arrayProduct = [];
      arrayProduct.push(product);
      localStorage.setItem("produits", JSON.stringify(arrayProduct));
      console.log(arrayProduct);
      toConfirm();
      quantity.value = 0;
    }
  }
});