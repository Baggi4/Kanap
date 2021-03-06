document.addEventListener("DOMContentLoaded", function (event) {


  //-------------------fonction principale-------------------//
  //--------------------------------------------------------//
  async function main() {

    let ApiArray = [];

    let localStorageArray = getLocalStorageProduct();

    for (let i = 0; i < localStorageArray.length; i++) {
      ApiArray.push(await GetApi(localStorageArray[i]));
    }

    let AllProducts = ConcatArray(localStorageArray, ApiArray);

    DisplayProduct(AllProducts);

    DisplayTotalPrice(AllProducts);

    Listen(AllProducts);

    // Fonction Verification Regex
    Validation();
  }

  main();

  //------------------------Récupération du LocalStorage -----------------------//
  //-------------------------------------------------------------------------//
  function getLocalStorageProduct() {

    //déclaration de variable
    let getLocalStorage = [];
    for (let i = 0; i < localStorage.length; i++) {
      getLocalStorage[i] = JSON.parse(localStorage.getItem(localStorage.key(i)));

    }
    return getLocalStorage;

  }

  //------------------------Récupération de l'API -----------------------//
  //--------------------------------------------------------------------//
  function GetApi(localStorageArray) {

    return fetch("http://localhost:3000/api/products/" + localStorageArray.id)
      .then(function (response) {
        return response.json();
      })
      .catch(function (error) {
        console.log(error);
      })

  }


  //------------------------Récupération du LocalStorage -----------------------//
  //-------------------------------------------------------------------------//
  class ProductClass {
    constructor(id, name, color, qty, alttxt, description, imageurl, price) {
      this.id = id;
      this.name = name;
      this.color = color;
      this.qty = qty;
      this.alttxt = alttxt;
      this.description = description;
      this.imageurl = imageurl;
      this.price = price;
    }
  }


  //----------------Concaténer localStorage et api -----------------------//
  //----------------------------------------------------------------------//
  function ConcatArray(localStorageArray, ApiArray) {

    let AllProducts = [];

    for (let i = 0; i < localStorageArray.length; i++) {

      let ObjectProduct = new ProductClass(
        localStorageArray[i].id,
        ApiArray[i].name,
        localStorageArray[i].color,
        localStorageArray[i].qty,
        ApiArray[i].altTxt,
        ApiArray[i].description,
        ApiArray[i].imageUrl,
        ApiArray[i].price,

      );

      AllProducts.push(ObjectProduct);

    }

    return AllProducts;

  }


  //-------------------Fonction d'affichage des produits-------------------//
  //-----------------------------------------------------------------------//
  function DisplayProduct(AllProducts) {

    for (product of AllProducts) {

      // On stock notre balise Html.
      const domCreation = document.getElementById("cart__items");
      // On push nos nouvels informations dans notre Html.
      domCreation.insertAdjacentHTML(
        "beforeend",
        `<article class="cart__item" data-id="${product._id}" data-color="${product.colors}">
              <div class="cart__item__img">
                <img src="${product.imageurl}" alt="${product.altTxt}">
              </div>
              <div class="cart__item__content">
                <div class="cart__item__content__description">
                  <h2>${product.name}</h2>
                  <p>${product.color}</p>
                  <p>${product.price} €</p>
                </div>
                <div class="cart__item__content__settings">
                  <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.qty}">
                  </div>
                  <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                  </div>
                </div>
              </div>
            </article>
            `
      );
    }
  }

  //-------------------Fonction affichage prix total-------------------//
  //------------------------------------------------------------------//
  function DisplayTotalPrice(AllProducts) {
    // de base 2 variable a 0
    let totalPrice = 0;
    let totalQty = 0;

    for (product of AllProducts) {
      totalPrice += parseInt(product.qty * product.price);
      totalQty += parseInt(product.qty);
    }

    const DtotalQty = document.getElementById("totalQuantity");
    const DtotalPrice = document.getElementById("totalPrice");

    DtotalQty.innerText = totalQty;
    DtotalPrice.innerText = totalPrice;
  }


  //-------------------Fonction principal d'écoute-------------------//
  //----------------------------------------------------------------//
  function Listen(AllProducts) {
    // Fonction si changement dans notre input quantity.
    ecoutequantity(AllProducts);
    // Fonction si on veux supprimer un éléments de la liste.
    ecoutedeleteProduct(AllProducts);
  }

  //-------------------Fonction d'écoute de quantité-------------------//
  //-------------------------------------------------------------------//
  function ecoutequantity(AllProducts) {
    let qtyinput = document.querySelectorAll(".itemQuantity");

    qtyinput.forEach(function (input) {
      input.addEventListener("change", function (inputevent) {

        let inputQty = inputevent.target.value;

        if (inputQty >= 1 && inputQty <= 100) {
          const Name = input
            .closest("div.cart__item__content")
            .querySelector("div.cart__item__content__description > h2").innerText;

          const color = input
            .closest("div.cart__item__content")
            .querySelector("div.cart__item__content__description > p").innerText;

          const productName = Name + " " + color;

          let localstorageKey = JSON.parse(localStorage.getItem(productName));
          localstorageKey.qty = inputQty;
          localStorage.setItem(productName, JSON.stringify(localstorageKey));

          const result = AllProducts.find(AllProduct => AllProduct.name === localstorageKey.name && AllProduct.color === localstorageKey.color);
          result.qty = inputQty;

          DisplayTotalPrice(AllProducts);

        } else {
          alert("Choisis une bonne quantité trou de balle.")
        }
      })
    })

  }

  //-------------------Fonction ecoute produit supprmimé-------------------//
  //-----------------------------------------------------------------------//

  function ecoutedeleteProduct(AllProducts) {
    let deleteLink = document.querySelectorAll(".deleteItem");

    deleteLink.forEach(function (input) {
      input.addEventListener("click", function () {
        const Name = input
          .closest("div.cart__item__content")
          .querySelector("div.cart__item__content__description > h2").innerText;

        const color = input
          .closest("div.cart__item__content")
          .querySelector("div.cart__item__content__description > p").innerText;

        const productName = Name + " " + color;

        let localstorageKey = JSON.parse(localStorage.getItem(productName));

        localStorage.removeItem(productName);

        input.closest("article.cart__item").remove();

        const result = AllProducts.find(AllProduct => AllProduct.name === localstorageKey.name && AllProduct.color === localstorageKey.color);

        AllProducts = AllProducts.filter(product => product !== result);

        ecoutequantity(AllProducts);

        DisplayTotalPrice(AllProducts);
      })
    })

  }

  //---------------------Validation formulaire------------------------//
  //------------------------------------------------------------------//

  function ValidationForm(form) {

    // Initialisation de nos variables de test.
    const stringRegex = /^[a-zA-Z-]+$/;
    const emailRegex = /^\w+([.-]?\w+)@\w+([.-]?\w+).(.\w{2,3})+$/;
    const addressRegex = /^[a-zA-Z0-9\s,.'-]{3,}$/;
    let control = true;


    // Si une des valeurs dans nos inputs de notre Form on affiche un méssage d'érreur.
    if (!form.firstName.value.match(stringRegex)) {
      document.getElementById("firstNameErrorMsg").innerText = "Mauvais prénom";
      control = false;
      // Sinon on affiche rien
    } else {
      document.getElementById("firstNameErrorMsg").innerText = "";
    }

    if (!form.lastName.value.match(stringRegex)) {
      document.getElementById("lastNameErrorMsg").innerText = "Mauvais nom";
      control = false;
      // Sinon on affiche rien
    } else {
      document.getElementById("lastNameErrorMsg").innerText = "";
    }

    if (!form.address.value.match(addressRegex)) {
      document.getElementById("addressErrorMsg").innerText = "Mauvaise adresse";
      control = false;
      // Sinon on affiche rien
    } else {
      document.getElementById("addressErrorMsg").innerText = "";
    }

    if (!form.city.value.match(stringRegex)) {
      document.getElementById("cityErrorMsg").innerText = "Mauvaise ville";
      control = false;
      // Sinon on affiche rien
    } else {
      document.getElementById("cityErrorMsg").innerText = "";
    }

    if (!form.email.value.match(emailRegex)) {
      document.getElementById("emailErrorMsg").innerText = "Mauvais email";
      control = false;
      // Sinon on affiche rien
    } else {
      document.getElementById("emailErrorMsg").innerText = "";
    }

    if (control) {
      return true;
    } else {
      return false;
    }

  }

  //---------------------Fonction de validation------------------------//
  //-------------------------------------------------------------------//

  function Validation() {

    let orderButton = document.getElementById("order");

    orderButton.addEventListener("click", function (event) {
      let form = document.querySelector(".cart__order__form");
      event.preventDefault();

      if (localStorage.length !== 0) {
        if (ValidationForm(form)) {

          // On créer un object avec nos valeurs du formulaire.
          let formInfo = {
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            address: form.address.value,
            city: form.city.value,
            email: form.email.value,
          };

          // Initialisation de notre array à vide. 
          let product = [];

          // Boucle for pour récupérer nos éléments du localstorage.
          for (let i = 0; i < localStorage.length; i++) {
            product[i] = JSON.parse(localStorage.getItem(localStorage.key(i))).id;
          }

          // On créer un object avec notre formulaire validé + nos product du localstorage.
          const order = {
            contact: formInfo,
            products: product,
          };

          // Méthode Appel Ajax en POST en inculant notre commande(order). 
          const options = {
            method: "POST",
            body: JSON.stringify(order),
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          };
          fetch("http://localhost:3000/api/products/order/", options)
            .then((response) => response.json())
            .then(function (data) {
              window.location.href = "confirmation.html?id=" + data.orderId;
            })
            .catch(function (error) {
              alert("Error fetch order" + error.message);
            })


        } else {
          event.preventDefault();
          alert("Le formulaire est mal remplis.")
        }
      } else {
        event.preventDefault();
        alert("Votre panier est vide.");
      }
    })
  }

})