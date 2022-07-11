const paramsUrl = new URLSearchParams(document.location.search);
const productCart = JSON.parse(localStorage.getItem("produits"));
const parametre = paramsUrl.get("id");
const idOrders = document.getElementById("orderId");
idOrders.textContent = parametre;
