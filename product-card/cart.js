let data = {};
getProducts();
showProducts();
function getProducts() {
  data = JSON.parse(localStorage.getItem('cart'));
}

function showProducts() {
  helpers();
  getSum();
  let template = document.querySelector('#product-list').innerHTML;
  let compiledTemplate = Handlebars.compile(template);
  let finishTemplate = compiledTemplate(data);
  document.querySelector('tbody').innerHTML = finishTemplate;

  let deleteBtns = document.querySelectorAll(".delete-btn");
  let increaseBtns = document.querySelectorAll(".increase-btn");
  let decreaseBtns = document.querySelectorAll('.decrease-btn');

  decreaseBtns.forEach(item => {
    item.onclick = decreaseProduct;
  })

  increaseBtns.forEach(item => {
    item.onclick = increaseProduct;
  })

  deleteBtns.forEach(item => {
    item.onclick = deleteProducts;
  })


}

function decreaseProduct() {
  let id = event.target.dataset.id;
  data[id].count--;
  // data[id].price /= data[id].count;
  if (data[id].count === 0) delete data[id];
  saveToStorage();
  getProducts();
  showProducts()

}

function increaseProduct(e) {
  let id = e.target.dataset.id;
  data[id].count++;
  // data[id].price *= data[id].count;
  saveToStorage();
  getProducts();
  showProducts()
}

function deleteProducts(e) {
  let id = e.target.dataset.id;
  delete data[id];
  saveToStorage();
  getProducts();
  showProducts();
}

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(data));
}

function helpers() {
  Handlebars.registerHelper('Sum', function (price, count) {
    return price * count;
  });
}

function getSum() {
  let sum = 0;
  for (let i in data) {
    sum += data[i].count * data[i].price;
  }
  showSum(sum);
}

function showSum(sum) {
  let template = document.querySelector('#sum').innerHTML;
  let compiledTemplate = Handlebars.compile(template);
  let finishTemplate = compiledTemplate({sum});
  document.querySelector('#total-place').innerHTML = finishTemplate;
}
let submitBtn = document.querySelector('#submit-order');
submitBtn.onclick = getOrders;
function getOrders(){
  let formElements = document.querySelectorAll('.order-form input');
  let date = new Date();
  let dataFor = {order: data, date: date, status};
  formElements.forEach(item => {
    // data = {item};
    dataFor[item.name] = item.value;
  })
  let url = 'http://localhost:3333/orders'

  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dataFor)
  }
  fetch(url, options)
  .then(response => response.json())
  .then(data => console.log(data));

}