const parametreUrl = new URLSearchParams(document.location.search);           
const nameParams = parametreUrl.get("id");
const imagProd = document.createElement("img");
const colorOption = document.getElementById("colors");
const btnAddToCart = document.getElementById("addToCart");
let productsInfo = [];
let colorProd = [];
let quantityValue = 0;
let colorSelected = "";
// search data product params // 
const fetchProducts = async() => {
	await fetch("http://localhost:3000/api/products").then((res) => res.json()).then(
		(data) => (productsInfo = data.filter((product) => {
			return product._id == nameParams;
		})));
};
// DOM //
// Return img product //
const imgProduct = async() => {
	productsInfo.forEach((product) => {
		imagProd.setAttribute("src", product.imageUrl);
		imagProd.setAttribute("alt", product.altTxt);
		document.querySelector(".item__img").appendChild(imagProd);
	});
};
// Return Price & Name of Product //
const contentProducts = async() => {
	document.getElementById("title").textContent = productsInfo.map(
		(product) => (product = product.name));
	document.getElementById("price").textContent = productsInfo.map(
		(product) => (product = product.price));
};
// Return Product description //
const descriptionProduct = async() => {
	document.getElementById("description").textContent = productsInfo.map(
		(product) => (product = product.description));
};
// Return Color product //
const colorProduct = async() => {
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
// Functions call // 
const productSelected = async() => {
	await fetchProducts();
	await imgProduct();
	await contentProducts();
	await descriptionProduct();
	await colorProduct();
};
productSelected();
// Quantity Value //
const quantity = document.getElementById("quantity");
quantity.addEventListener("change", (e) => {
	quantityValue = e.target.value;
	let quantityVerification = new RegExp("^[0-9]{1,2}$"); 
	if(!quantityVerification.test(quantityValue)) {
		quantity.value = 0; 
		quantityValue = 0; 
	}
});
// Color //
document.getElementById("colors").setAttribute("onchange", "getSelectedValue()");
const getSelectedValue = () => {
	colorSelected = document.getElementById("colors").value;
};
// Confirm product //
const toConfirm = () => {
	if(
		confirm("Votre article a bien été ajouter au panier!")) {
		document.location.href = "cart.html";
	} else {
		document.location.href = "index.html";
	}
};
btnAddToCart.addEventListener("click", () => {
	if(colorSelected === "" || quantityValue == 0) {
		alert("Veuillez choisir une couleur");
	} else {
		let product = {
			// product id quantity && color //
			id: nameParams,
			quantity: quantityValue,
			color: colorSelected,
		};
		let arrayProduct = JSON.parse(localStorage.getItem("produits"));
		// if already product id into LocalStorage ==> add another one //
		if(arrayProduct) {
			// if product id & color already exist into array, incremente quantity +, else add another product //
			const getProduct = arrayProduct.find(
				(element) => element.id == product.id && element.color == product.color);
			if(getProduct) {
				getProduct.quantity = Number(getProduct.quantity) + Number(product.quantity);
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