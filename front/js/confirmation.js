// Afficher le numéro de commande
function confirmOrder() {
  const numberID = new URLSearchParams(document.location.search);
  let id = numberID.get("id");
  console.log(id);
  document.getElementById("orderId").innerHTML = id;
}
confirmOrder();
