const URL_API = "/api/v1";

let isUpdate = false;
let idUpdate = null;

// truy cap vao cac thanh phan
const todoListEl = document.querySelector(".todo-list");
const todoOptionItemsEl = document.querySelectorAll(".todo-option-item input");

const todoInput = document.getElementById("todo-input");
const btnAdd = document.getElementById("btn-add");

// Danh sach URL_API
const getTodoAPI = (status) => {
    switch (status) {
        case "all": {
            return axios.get(`${URL_API}/todos`);
        }
        case "unactive": {
            return axios.get(`${URL_API}/todos?status=false`);
        }
        case "active": {
            return axios.get(`${URL_API}/todos?status=true`);
        }
        default: {
            return axios.get(`${URL_API}/todos`);
        }
    }
};

const deleteTodoAPI = (id) => {
    return axios.delete(`${URL_API}/todos/${id}`);
};

const updateTodoAPI = (todo) => {
    return axios.put(`${URL_API}/todos/${todo.id}`, {
        title: todo.title,
        status: todo.status,
    });
};

const createTodoAPI = title => {
    return axios.post(`${URL_API}/todos/`, {
        title: title,
    });
}


// cac ham xu ly
const getTodos = async (status = "") => {
    try {
        let res = await getTodoAPI(status);

        todos = res.data;

        renderTodo(todos);
    } catch (error) {
        console.log(error);
    }
};

// hien thi mang
const renderTodo = (arr) => {
    todoListEl.innerHTML = "";
    if (arr.length === 0) {
        todoListEl.innerHTML = "Khong co cong viec trong danh sach";
        return;
    }

    let html = "";
    for (var i = 0; i < arr.length; i++) {
        const t = arr[i];
        html += `
        <div class="todo-item ${t.status ? "active-todo" : ""}">
                    <div class="todo-item-title">
                        <input type="checkbox"  ${t.status ? "checked" : ""}
                        onclick="toggleStatus(${t.id})"/>
                        <p>${t.title}</p>
                    </div>
                    <div class="option">
                        <button class="btn btn-update" onclick="updateTitle(${
            t.id
        })"
                        })">
                            <img src="./img/pencil.svg" alt="icon" />
                        </button>
                        <button class="btn btn-delete" onclick="deleteTodo(${
            t.id
        })">
                            <img src="./img/remove.svg" alt="icon" />
                        </button>
                    </div>
                </div>
        `;
    }
    todoListEl.innerHTML = html;
};

async function updateTodo(todoUpdate) {
    try {
        // G???i API c???p nh???t
        let res = await updateTodoAPI(todoUpdate);

        // C???p nh???t l???i trong m???ng todos
        todos.forEach((todo, index) => {
            if (todo.id == todoUpdate.id) {
                todos[index] = res.data;
            }
        });

        // Thay ?????i giao di???n v??? ban ?????u
        btnAdd.innerText = "Th??m";

        // Reset l???i bi???n sau khi ???? c???p nh???t th??nh c??ng
        isUpdate = false;
        idUpdate = null;

        renderTodo(todos);
    } catch (error) {
        console.log(error);
    }
}

const deleteTodo = async (id) => {
    try {
        let isConfirm = confirm("Are you sure you want to delete?");
        if (isConfirm) {
            // xoa tren service

            await deleteTodoAPI(id);

            //xoa trong mang todos
            todos.forEach((todo, index) => {
                if (todo.id == id) {
                    todos.splice(index, 1);
                }
            });

            // render lai giao dien
            renderTodo(todos);
        }
    } catch (error) {
        console.log(error);
    }
};

// C???p nh???t ti??u ????? todo
function updateTitle(id) {
    let title;

    // T??m ki???m c??ng vi???c mu???n c???p nh???t v?? l??u l???i gi?? tr??? title
    todos.forEach((todo) => {
        if (todo.id == id) {
            title = todo.title;
        }
    });

    // ?????i t??n "TH??M" -> "C???P NH???T"
    btnAdd.innerText = "C???P NH???T";

    // Hi???n th??? ti??u ????? c???n c???p nh???t l??n ?? input
    todoInput.value = title;
    todoInput.focus();

    // L??u l???i id c???a c??ng vi???c c???n c???p nh???t v?? cho ph??p c???p nh???t
    idUpdate = id;
    isUpdate = true;
}

btnAdd.addEventListener("click", function () {
    // L???y ti??u ????? trong ?? input
    let todoTitle = todoInput.value;

    // Ki???m tra xem ti??u ????? c?? tr???ng hay kh??ng
    if (todoTitle == "") {
        alert("N???i dung kh??ng ???????c ????? tr???ng!");
        return;
    }

    // N???u isUpdate == true th?? cho ph??p c???p nh???t
    // Ng?????c l???i isUpdate == false th?? cho ph??p th??m
    if (isUpdate) {
        // T??m c??ng vi??c c?? id = idUpdate
        let todo = todos.find((todo) => todo.id == idUpdate);

        // S???a l???i ti??u ????? c???a c??ng vi???c ???? = n???i dung trong ?? input
        todo.title = todoTitle;

        // Th???c hi???n c???p nh???t
        updateTodo(todo);
    } else {
        // Th???c hi???n th??m c??ng vi???c
        createTodo(todoTitle);
    }

    todoInput.value = "";
});

const toggleStatus = async (id) => {
    try {
        // lay ra cong viec can update trong mang todos
        let todo = todos.find((todo) => todo.id == id);

        // thay doi trang thai cong viec
        todo.status = !todo.status;

        let res = await updateTodoAPI(todo);

        renderTodo(todos);
    } catch (error) {
        console.log(error);
    }
};

// L???c c??ng vi???c theo tr???ng th??i
// L???ng nghe s??? ki???n tr??n c??c ?? input
todoOptionItemsEl.forEach((input) => {
    input.addEventListener("change", function () {
        // N???u ?? input v??o ??ang ???????c ch???n --> l???y ra value
        let status = input.value;

        // G???i API ????? l???y c??ng vi???c theo tr???ng th??i --> hi???n th???
        getTodos(status);
    });
});

// H??m x??? l?? vi???c th??m
async function createTodo(title) {
    try {
        // G???i API t???o todo
        const res = await createTodoAPI(title);

        // Khi c?? k???t qu??? tr??? v??? t??? server th?? th??m v??o trong m???ng todos
        todos.push(res.data)

        // Render ra ngo??i giao di???n
        renderTodo(todos);
    } catch (error) {
        console.log(error);
    }
}
