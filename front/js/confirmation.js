// Afficher le numéro de commande
function numberBuying() {
	const numberID = new URLSearchParams(document.location.search);
	let id = numberID.get("id");
	console.log(id);
	document.getElementById("orderId").innerHTML = id;
}
numberBuying()