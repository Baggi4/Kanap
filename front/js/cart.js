function productItems() {
  /*Récupérer les données stockées dans le localstorage*/
  let saveProduct = JSON.parse(localStorage.getItem("product"));
  let panierDataView = document.getElementById("cart__items");
  /*Afficher les données des produits dans le panier */
  if (saveProduct == null) {
    /*Pas de changement si le panier est vide*/
  } else {
    for (let i = 0; i < saveProduct.length; i++) {
      panierDataView.innerHTML += ` <article class="cart__item" data-id="${saveProduct[i].id}" data-color="${saveProduct[i].color}">
              <div class="cart__item__img">
                  <img src="${saveProduct[i].itemImg}" alt="${saveProduct[i].altTxt}" />
                  </div>
                  <div class="cart__item__content">
                    <div class="cart__item__content__description">
                      <h2>${saveProduct[i].title}</h2>
                      <p>${saveProduct[i].color}</p>
                      <p>${saveProduct[i].price} €</p>
                    </div>
                    <div class="cart__item__content__settings">
                      <div class="cart__item__content__settings__quantity">
                        <p>Qté : </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${saveProduct[i].quantity}>
                      </div>
                      <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                      </div>
                    </div>
                  </div>
                </article> `;
    }
  }
}
productItems();
/*Supprimer un article*/
function productDelete() {
  let saveProduct = JSON.parse(localStorage.getItem("product"));
  const btnDelete = document.querySelectorAll(".deleteItem");
  for (let o = 0; o < btnDelete.length; o++) {
    btnDelete[o].addEventListener("click", (event) => {
      let article = event.target.closest("article");
      let id = article.dataset.id;
      let color = article.dataset.color;
      saveProduct = saveProduct.filter((s) => s.id !== id || s.color !== color);
      localStorage.setItem("product", JSON.stringify(saveProduct));
      article.remove();
      calculate();
    });
  }
}
productDelete();
/*Quantité à modifier page panier*/
function productQuantity() {
  let saveProduct = JSON.parse(localStorage.getItem("product"));
  let butonAdd = document.querySelectorAll(".itemQuantity");
  console.log(typeof butonAdd);
  for (let w = 0; w < butonAdd.length; w++) {
    butonAdd[w].addEventListener("change", (event) => {
      let article = event.target.closest("article");
      let id = article.dataset.id;
      let color = article.dataset.color;
      let quantity = parseInt(butonAdd[w].value);
      for (let h = 0; h < saveProduct.length; h++) {
        if (saveProduct[h].id == id && saveProduct[h].color == color) {
          saveProduct[h].quantity = quantity;
          localStorage.setItem("product", JSON.stringify(saveProduct));
          calculate();
          return;
        }
      }
    });
  }
}
productQuantity();
/*Prix total / Quantité totale du panier*/
function calculate() {
  let saveProduct = JSON.parse(localStorage.getItem("product"));
  let fullQuantity = 0;
  let fullPrice = 0;
  for (let pushPrice of saveProduct) {
    fullPrice += pushPrice.price * pushPrice.quantity;
    fullQuantity += pushPrice.quantity;
    console.log(pushPrice);
  }
  document.getElementById("totalQuantity").innerHTML = fullQuantity;
  document.getElementById("totalPrice").innerHTML = fullPrice;
}
calculate();
/*Envoie la commande*/
function infoSend() {
  const btnSend = document.querySelector("#order");
  btnSend.addEventListener("click", (event) => {
    event.preventDefault();
    //Formulaire
    let contact = {
      firstName: document.querySelector("#firstName").value,
      lastName: document.querySelector("#lastName").value,
      address: document.querySelector("#address").value,
      city: document.querySelector("#city").value,
      email: document.querySelector("#email").value,
    };
    //Contrôler le formulaire
    //Firstname, Lastname, City
    const alertValue = (variable) => {
      return `${variable} :  invalid`;
    };
    const RegExp = (value) => {
      return /^[\w^.-]{2,15}[\w]{2,6}$/.test(value);
    };
    /*"/": prend en compte ; "^": début de la saisie; "$": fin de la saisie*/
    function firstnameControl() {
      if (RegExp(contact.firstName)) {
        return true;
      } else {
        alert(alertValue("Prénom"));
        return false;
      }
    }

    function lastnameControl() {
      if (RegExp(contact.lastName)) {
        return true;
      } else {
        alert(alertValue("Nom"));
        return false;
      }
    }

    function cityControl() {
      if (RegExp(contact.city)) {
        return true;
      } else {
        alert(alertValue("Ville"));
        return false;
      }
    }
    //Adresse
    const RegExpA = (value) => {
      return /^[\sA-Za-z0-9,.]{5,35}[\sA-Za-z0-9]{5,35}$/.test(value);
    };

    function addressControl() {
      if (RegExpA(contact.address)) {
        return true;
      } else {
        alert("L'adresse n'est pas valide");
        return false;
      }
    }
    //Email
    const RegExpM = (value) => {
      return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
      // "(" : permet la répétitions
    };

    function emailControl() {
      if (RegExpM(contact.email)) {
        return true;
      } else {
        alert("L'adresse mail n'est pas valide");
        return false;
      }
    }
    //Envoie dans le localStorage
    let verification = false;
    if (
      firstnameControl() &&
      lastnameControl() &&
      cityControl() &&
      emailControl() &&
      addressControl()
    ) {
      localStorage.setItem("contact", JSON.stringify(contact));
      verification = true;
    } else {
      //Pas d'actions nécessaire
    }
    //Objet contenant les produits et le contact
    let saveProduct = JSON.parse(localStorage.getItem("product"));
    let products = [];
    saveProduct.forEach((element) => products.push(element.id));
    const foo = {
      products,
      contact,
    };
    console.log(foo);
    /*Enregistrer la commande*/
    function sendtoConfirmation() {
      let post = {
        method: "POST",
        body: JSON.stringify(foo),
        headers: {
          "Content-Type": "application/json",
        },
      };
      if (verification && products.length > 0) {
        fetch("http://localhost:3000/api/products/order", post)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            let orderId = data.orderId;
            window.location.href = `./confirmation.html?id=${orderId}`;
            console.log(orderId);
          });
      }
    }
    sendtoConfirmation();
  });
}
infoSend();
