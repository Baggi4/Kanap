const articles = document.getElementsByClassName("cart__item");
const form = document.querySelector(".cart__order__form");
const inputFirstName = document.getElementById("firstName");
const inputLastName = document.getElementById("lastName");
const inputAddress = document.getElementById("address");
const inputCity = document.getElementById("city");
const inputEmail = document.getElementById("email");

let myCart = JSON.parse(localStorage.getItem("produits"));
let idInCart = [];
let productInCart = [];

// return array with "id" into localStorage //
const idCart = async() => {
	idInCart = myCart.map((product) => {
		product = product.id;
		return product;
	});
};
// search infos product id located in the localStorage // 
const addToCart = async() => {
	await idCart();
	await fetch("http://localhost:3000/api/products").then((res) => res.json()).then((data) => {
		productInCart = data.filter((product) => {
			for(element of idInCart) {
				if(product._id == element) return product;
			}
		});
	});
};
// Return localStorage product //
const articleInCart = async() => {
	await addToCart();
	myCart.forEach((element) => {
		const article = document.createElement("article");
		article.classList.add("cart__item");
		article.setAttribute("data-id", element.id);
		article.setAttribute("data-color", element.color);
		const divImg = document.createElement("div");
		divImg.classList.add("cart__item__img");
		const image = document.createElement("img");
		productInCart.filter((product) => {
			if(product._id == element.id) {
				image.setAttribute("src", product.imageUrl);
				image.setAttribute("alt", product.altTxt);
				divImg.appendChild(image);
			}
		});
		const divContent = document.createElement("div");
		divContent.classList.add("cart__item__content");
		const divDescription = document.createElement("div");
		divDescription.classList.add("cart__item__content__description");
		const h2 = document.createElement("h2");
		productInCart.filter((product) => {
			if(product._id == element.id) {
				h2.textContent = product.name;
			}
		});
		const color = document.createElement("p");
		color.textContent = element.color;
		const price = document.createElement("p");
		productInCart.filter((product) => {
			if(product._id == element.id) {
				price.textContent = product.price + ",00 €";
			}
		});
		divDescription.appendChild(h2);
		divDescription.appendChild(color);
		divDescription.appendChild(price);
		const divSettings = document.createElement("div");
		divSettings.classList.add("cart__item__content__settings");
		const divQuantity = document.createElement("div");
		divQuantity.classList.add("cart__item__content__settings__quantity");
		const pQte = document.createElement("p");
		pQte.textContent = "Qté : ";
		const quantity = document.createElement("input");
		quantity.classList.add("itemQuantity");
		quantity.setAttribute("type", "number");
		quantity.setAttribute("name", "itemQuantity");
		quantity.setAttribute("min", "1");
		quantity.setAttribute("max", "100");
		quantity.setAttribute("value", element.quantity);
		divQuantity.appendChild(pQte);
		divQuantity.appendChild(quantity);
		const divDelate = document.createElement("div");
		divDelate.classList.add("cart__item__content__settings__delete");
		const delate = document.createElement("p");
		delate.classList.add("deleteItem");
		delate.textContent = "Supprimer";
		divDelate.appendChild(delate);
		divSettings.appendChild(divQuantity);
		divSettings.appendChild(divDelate);
		divContent.appendChild(divDescription);
		divContent.appendChild(divSettings);
		article.appendChild(divImg);
		article.appendChild(divContent);
		document.getElementById("cart__items").appendChild(article);
	});
};
// Hide Form if Shop cart is empty(vide) || if localStorage product doesnt exist || if localStorage is empty //
const cartIsEmpty = () => {
	if(!myCart) {
		form.style.visibility = "hidden";
	} else if(myCart.length == 0) {
		form.style.visibility = "hidden";
	} else form.style.visibility = "visible";
};
cartIsEmpty();
// Remove product //
const deleteFunction = async() => {
	const btnDelete = document.querySelectorAll(".deleteItem");
	for(let i = 0; i < btnDelete.length; i++) {
		let remove = btnDelete[i];
		remove.addEventListener("click", () => {
			// remove product from array into localStorage //
			myCart.splice(i, 1);
			// Remove article from DOM //
			articles[i].remove();
			// Update localStorage //
			localStorage.setItem("produits", JSON.stringify(myCart));
			// Update Panier //
			location.reload(); 
		});
	}
};
// Modify quantity //
const quantityModify = async() => {
	const inputQuantity = document.getElementsByClassName("itemQuantity");
	for(let i = 0; i < inputQuantity.length; i++) {
		let modify = inputQuantity[i];
		modify.addEventListener("change", (e) => {
			myCart[i].quantity = e.target.value; // Update localStorage quantity //
			// Remove product if value quantity = 0 //
			if(myCart[i].quantity <= 0) {
				myCart.splice(i, 1);
				articles[i].remove();
				localStorage.setItem("produits", JSON.stringify(myCart));
				location.reload();
			}
			localStorage.setItem("produits", JSON.stringify(myCart));
			location.reload();
		});
	}
};
const totalQuantity = async() => {
	const totalQte = document.getElementById("totalQuantity");
	let total = 0;
	myCart.map((element) => {
		total += Number(element.quantity);
	});
	totalQte.textContent = total;
};
const totalPrice = async() => {
	const totalPrice = document.getElementById("totalPrice");
	let total = 0;
	let pricePerProduct = 0;
	myCart.filter((element) => {
		productInCart.filter((product) => {
			if(element.id == product._id) {
				pricePerProduct = Number(element.quantity) * Number(product.price);
			}
		});
		total += pricePerProduct;
	});
	totalPrice.textContent = total;
};
const pinUp = async() => {
	if(myCart) {
		await articleInCart();
		await deleteFunction();
		await quantityModify();
		await totalQuantity();
		await totalPrice();
	}
};
pinUp();
// Formulaire
const isValid = (test) => {
	let name = new RegExp("^[A-Za-zéèê -]{3,}$");
	return name.test(test);
};
form.firstName.addEventListener("change", () => {
	let messageVerification = document.getElementById("firstNameErrorMsg");
	if(isValid(firstName.value)) {
		messageVerification.textContent = "";
	} else messageVerification.textContent = "Invalid FirstName";
});
form.lastName.addEventListener("change", () => {
	let messageVerification = document.getElementById("lastNameErrorMsg");
	if(isValid(lastName.value)) {
		messageVerification.textContent = "";
	} else messageVerification.textContent = "Invalid Name ";
});
const addressIsValid = (test) => {
	let address = new RegExp("^[a-zA-Z0-9éèê,. '-]{3,}$");
	return address.test(test); // input value test //
};
form.address.addEventListener("change", () => {
	let messageVerification = document.getElementById("addressErrorMsg");
	if(addressIsValid(address.value)) {
		messageVerification.textContent = "";
	} else messageVerification.textContent = "Invalid adress ";
});
form.city.addEventListener("change", () => {
	let messageVerification = document.getElementById("cityErrorMsg");
	if(isValid(city.value)) {
		messageVerification.textContent = "";
	} else messageVerification.textContent = "Invalid city";
});
const emailIsValid = (test) => {
	let email = new RegExp("^[A-Za-z0-9.-_]{1,}[@]{1}[A-Za-z0-9-_]{1,}[.]{1}[a-z]{2,4}$");
	return email.test(test);
};
form.email.addEventListener("change", () => {
	let messageVerification = document.getElementById("emailErrorMsg");
	if(emailIsValid(email.value)) {
		messageVerification.textContent = "";
	} else messageVerification.textContent = "Invalid email";
});
const btnOrder = document.getElementById("order");
btnOrder.addEventListener("click", (e) => {
	e.preventDefault();
	if(
		// Form Verification //
		isValid(firstName.value) && isValid(lastName.value) && isValid(city.value) && addressIsValid(address.value) && emailIsValid(email.value)) {
		let order = {
			contact: {
				firstName: inputFirstName.value,
				lastName: inputLastName.value,
				address: inputAddress.value,
				city: inputCity.value,
				email: inputEmail.value,
			},
			products: idInCart,
		};
		fetch("http://localhost:3000/api/products/order", {
			method: "POST",
			headers: {
				"Content-Type": "application/JSON",
			},
			body: JSON.stringify(order),
		}).then((res) => res.json()).then((data) => {
			document.location.href = "confirmation.html?id=" + data.orderId;
			localStorage.removeItem("produits"); // Clear localStorage
		}).catch((error) => console.log(error));
	} else {
		alert("Veillez renseigner vos coordonnées");
	}
});