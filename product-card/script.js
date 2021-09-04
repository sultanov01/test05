let cart = {};
let total = document.querySelector("#total");
let sum = 0;
let id;
function getProducts() {
  const url = "http://localhost:3333/products"

  fetch(url)
    .then(response => response.json())
    .then(data => showProducts(data))
}
getProducts();

function showProducts(data) {

  let template = document.querySelector('#product-card').innerHTML;
  let compiledTemplate = Handlebars.compile(template);
  let finishTemplate = compiledTemplate(data);
  document.querySelector('#root').innerHTML = finishTemplate;
  let addBtns = document.querySelectorAll('.add-cart');

  addBtns.forEach(item => {
    item.onclick = addCart;
  })
}

function addCart() {
  id = event.target.dataset.id;
  let name = event.target.dataset.name;
  let price = event.target.dataset.price;
  if (cart[id]) {
    cart[id].count++
  } else {
    cart[id] = { name, price, count: 1 };
  }
  console.log(cart);

  setStorage();
  countOfCartSumm();
}
function countOfCartSumm() {
  if (cart[id].price == "") {
    alert("error");
    return;
  } else {
    sum += parseInt(cart[id].price);
    total.innerHTML = sum;
  }
}
function setStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}
