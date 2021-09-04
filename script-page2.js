const URL = 'http://localhost:3333/productsGroup'
let btnModal = document.querySelector("#btn");
let editBtn = document.querySelector('#editBtn');
let id;

let bodyTablePage2 = document.querySelector("#body-table-page2");
function showProductGroup(dataB) {
    let tr = '';
    dataB.forEach((element) => {
        tr += `
            <tr>
                <td>${element.id}</td>
                <td>${element.name}</td>
                <td>${element.description}<td>
                    <button data-id="${element.id}" class="btn btn-danger delete-btn">Удалить</button>
                    <button type="button" data-id="${element.id}" id="patchBtn" class="btn btn-primary modals" data-bs-toggle="modal" data-bs-target="#modals" data-bs-whatever="@fat">Редактировать</button>
            </tr>
        `
    })
    bodyTablePage2.innerHTML = tr;

    let deleteBtns = document.querySelectorAll('.delete-btn');
    let editBtns = document.querySelectorAll(".modals"); 

    deleteBtns.forEach((item) => {
        item.onclick = deleteUser;
    });

    editBtns.forEach((element) => {
        element.onclick = editUser;
    })
}

let getProducts = () => {
    fetch(URL)
        .then(response => response.json())
        .then(data => showProductGroup(data))
};

getProducts();

btnModal.onclick = function () {
    let name = document.querySelector('#md-name').value;
    let description = document.querySelector("#md-description").value;
    let newOption = new Option(name).value

    let data = { name, description, newOption };
    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }

    fetch(URL, options)
        .then(response => response.json)
        .then(data => getProducts())

        
}

let deleteUser = () => {
    id = event.target.dataset.id;

    let options = {
        method: "DELETE"
    }

    fetch(`${URL}/${id}`, options)
        .then(response => response.json)
        .then(data => {
            console.log(data)
            getProducts();
        })
}

let editUser = () => {
    id = event.target.dataset.id;

    const url = `http://localhost:3333/productsGroup/${id}`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        document.querySelector("#edit-name").value = data.name;
        document.querySelector("#edit-description").value = data.description;
    })
}

editBtn.onclick = function(){
    let editUrl = `${URL}/${id}`;
    let elements = document.querySelectorAll("#edit-form input");
    let data = {};

    elements.forEach((elem) => {
        data[elem.name] = elem.value;
    })

    let options = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }
    fetch(editUrl, options)
        .then(data => data.json())
        .then(response => {
            console.log(response);
            getProducts();
        })
}

  let btnSearch = document.querySelector("#btn-search");

  btnSearch.onclick = searchProduct;
  
  function searchProduct(){
      let searchInput = document.querySelector('#search-name');
      let params;

      if (!searchInput.value) {
        alert('Заполните поле!');
        return;
    }

    else if (searchInput.value) {
        params = `?name=${searchInput.value}`
    }
    const url = `${URL}${params}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            showProductGroup(data)
            console.log(data);
            if (data.length == 0) {
                alert('Товар не найден');
                location.reload();
            }
        })
  }
//   function showProducts(data){
  
//     let template = document.querySelector('#product-card').innerHTML;
//     let compiledTemplate = Handlebars.compile(template);
//     let finishTemplate = compiledTemplate(data);
//     document.querySelector('#root').innerHTML = finishTemplate;
    
//     let addBtns = document.querySelectorAll('.add-cart');
  
//     addBtns.forEach(item => {
//       item.onclick = addCart;
//     })
//   }
//   function addCart(){
//     alert('123');
//   }