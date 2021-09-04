const URL = 'http://localhost:3333/products';
let editBtn = document.querySelector("#editBtn");
let id;
let btnSearch = document.querySelector("#btnSearch");
let modalBtn = document.getElementById('btn');
let photoSelect = document.querySelector("#photoSelect");
let variants = document.getElementsByClassName("hide");


// console.log(variants);

fetch('http://localhost:3333/productsGroup')
.then(response => response.json())
.then(data => {
    showProductGroup(data);
    console.log(data); 
});

function showVariants(){
    if(photoSelect.selectedIndex == 1){
        variants[0].classList.add('show');
        variants[1].classList.remove('show');
    }else if(photoSelect.selectedIndex == 2){
        variants[0].classList.remove('show');
        variants[1].classList.add('show');
    }else if(photoSelect.selectedIndex == 0){
        variants[0].classList.remove('show');
        variants[1].classList.remove('show');
    }
}

let getUsers = () => {
    fetch(URL)
        .then(response => response.json())
        .then(data => showUsers(data));
}

let deleteUser = () => {
    id = event.target.dataset.id;

    let options = {
        method: "DELETE"
    }

    fetch(`${URL}/${id}`, options)
        .then(response => response.json)
        .then(data => {
            // console.log(data)
            getUsers();
        })
}

let getUSerById = (id) => {
    const url = `http://localhost:3333/user/${id}`;
    let userData

    fetch(url)
        .then(response => response.json())
        .then(data => userData = data)

    return userData;
}

let editUser = () => {
    id = event.target.dataset.id;

    const url = `http://localhost:3333/products/${id}`;
    const urlproductGroup = `http://localhost:3333/productsGroup/${id}`;


    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.querySelector('#edit-name').value = data.name;
            document.querySelector('#edit-someText').value = data.someText;
            document.querySelector('#edit-price ').value = data.price;
            document.querySelector("#edit-status").selectedIndex = data.status;
            document.querySelector("#edit-productGroup").selectedIndex = data.tovarGroup;
            // console.log(data)
        })

};

editBtn.onclick = function () {
    let editUrl = `${URL}/${id}`;
    let elements = document.querySelectorAll("#edit-form input");
    let status = document.querySelectorAll("#edit-form select");
    let data = {};

    elements.forEach((elem) => {
        data[elem.name] = elem.value;
    })
    status.forEach((elem) => {
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
            // console.log(response);
            getUsers();
        });
}
function showProductGroupEdit(){
    let editProductGroup = document.querySelectorAll('.options');
  editProductGroup.forEach(item => {
      let newOption = new Option(item.value);
      console.log(newOption);
      let editProductGroupPlace = document.querySelector('#edit-productGroup');
      editProductGroupPlace.append(newOption);
  })  
  }

let showProductGroup = (data) => {
    let productSelector =  document.querySelector('#md-productGroup');
    // let productGroupSelector = document.querySelector('#edit-productGroup');
    data.forEach((item) => {
       let newOption = new Option(item.newOption); 
       newOption.classList.add('options');
       productSelector.append(newOption);
    //    productGroupSelector.append(newOption);
})
    showProductGroupEdit();     
    // console.log(data.newOption)
    
}
let showUsers = (data) => {
    let bodyTable = document.querySelector('.mainBlock');
    let tr = '';


    data.forEach((item) => {
        tr += `
        <div class="card m-3" style="width: 18rem;">
        <img src="..." class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${item.name}</h5>
          <p class="card-text">${item.someText}</p>
          <div class="d-flex align-items-end justify-content-space-between">
          <button type="button" data-id="${item.id}" id="patchBtn" class="btn btn-primary modals" data-bs-toggle="modal" data-bs-target="#modals" data-bs-whatever="@fat">Редактировать</button>
          <a href="#" class="ms-3 btn btn-danger delete-btn" data-id="${item.id}">Удалить</a>
          
          </div>
          <h4 class="">${item.price} сом</h4>
          <p>${item.status}</p>
        </div>
      </div>
    `
    })


    bodyTable.innerHTML = tr;

    let deleteBtns = document.querySelectorAll('.delete-btn');
    let editBtns = document.querySelectorAll('.modals')

    deleteBtns.forEach((item) => {
        item.onclick = deleteUser;
    });

    editBtns.forEach((item) => {
        item.onclick = editUser;
    });

}
getUsers();


modalBtn.onclick = function () {
    let name = document.getElementById('md-name').value;
    let someText = document.getElementById('md-someText').value;
    let price = document.getElementById('md-price').value;
    let status = document.querySelector("#exampleModal > div > div > div.modal-body > form > div:nth-child(4) > select").value;
    let tovarGroup = document.querySelector("#md-productGroup").value
    let photoURL;
    let photoFile;

    if(photoSelect.selectedIndex == 2){
        photoURL = document.querySelector('#photo').value;
    }else if(photoSelect.selectedIndex == 1){
        photoFile = document.querySelector("input[type=file]").files[0].name;
    }

    let obj = { name, someText, price, status, tovarGroup, photoURL,photoFile };

    let options = {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(obj)
    }

    fetch(URL, options)
        .then(obj => {
            obj.json();
            // location.reload();
            getUsers();
        });
}


btnSearch.onclick = function () {
    let name = document.querySelector('#s_name');
    let surname = document.querySelector('#s_surname');
    let params;
    // console.log(name)

    if (!name.value) {
        alert('Заполните поле!');
        return;
    }

    else if (name.value) {
        params = `?name=${name.value}`
    }
    const url = `${URL}${params}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            showUsers(data)
            if (data.length == 0) {
                alert('Товар не найден');
                location.reload();
            }
        })
}

