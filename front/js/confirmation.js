//Affichage de l'idOrder dans la page de confirmation
const paramsUrl = new URLSearchParams(document.location.search);
const productCart = JSON.parse(localStorage.getItem("produits"));

//Return les paramètres idOrder de URL
const parametre = paramsUrl.get("id");
const idOrders = document.getElementById("orderId");
idOrders.textContent = parametre;
