// Chức năng :

// 1.Thêm công việc

// 3.Thay đổi trạng thái công việc
// 4.Xóa 

// Đối tượng trong ứng dụng này là gì? Bao gồm những thuộc tính nào?
// ID, title, stasus.
let todos;
    
// 4 -> 10000
const randomId = () => {
    return Math.floor(Math.random() * (997) + 4);
}
// Truy cập
const todoListEl = document.querySelector(".todo-list");
const todoOptionEls = document.querySelectorAll(".todo-option-item input");
const todoInputEl = document.getElementById("todo-input");
const btnAdd = document.getElementById("btn-add");
const btnUpdate = document.querySelector(".btn-update");
const btnChange = document.getElementById("btn-update");
console.log(todoOptionEls)
// API lấy danh sách công việc

let getTodos = async () => {
    try {
        let res = await axios.get("/todos")
        todos = res.data;
        renderTodo(todos);
    } catch(error) {

    }
}
const renderTodo = arr => {
    todoListEl.innerHTML = "";
    // Kiểm tra danh sách công việc có tróng hay không?
    if(arr.length == 0) {
        todoListEl.innerHTML = `<p class ="todos-empty">Không có công việc nào trong danh sách</p>`;
        return;
    }
    // Hiển thị danh sách:
    let html = "";
    arr.forEach(t => {
        html += `<div class="todo-item ${t.status ? "active-todo" : ""}">
        <div class="todo-item-title">
            <input type="checkbox" ${t.status ? "checked" : ""}
            onclick="toggleStatus(${t.id})"
            />
            <p>${t.title}</p>
        </div>
        <div class="option">
            <button class="btn btn-update" onclick="updateTodo(${t.id})">
                <img src="./img/pencil.svg" alt="icon" />
            </button>
            <button class="btn btn-delete" onclick="deleteTodo(${t.id})">
                <img src="./img/remove.svg" alt="icon" />
            </button>
        </div>
    </div>`
    });
    todoListEl.innerHTML = html;
   

}
 //Xóa công việc
 const deleteTodo = async (id) => {
    try {
        // Gọi API xóa trên server
        await axios.delete(`/todos/${id}`);
    // Lọc ra các công việc muốn xóa
    todos = todos.filter(todo => todo.id != id);
    // Hiện thị trên giao diện
    renderTodo(todos)
    } catch(error) {
        console.log(error)
    }
        
}
// Thay đổi trạng thái công viêc 
const toggleStatus = async (id) => {
    try {
    //Lấy ra công việc cần thay đổi
    let todo = todos.find(todo => todo.id == id);
    // Thay đổi trạng thái của công việc đó: true -> false: false -> true;
    todo.status = !todo.status;
    // Gọi API
    await axios.put(`/todos/${id}`, todo);
    //hiển thị lên trên giao diện
    renderTodo(todos);

    } catch (error) {
        console.log(error)
    }
}
// Thêm công việc
const addTodo = async () => {
    //  Lấy ra dữ liệu trong ô input
let title = todoInputEl.value;

// Kiểm tra tiêu đề có trống hay không
if(title == "") {
    alert("Tiêu đề không được để trống");
    return;

}
// Tạo công việc mới
let newTodo = {
    id : randomId(),
    title : title,
    status : false
}
// Gọi API mới
let res = await axios.post("/todos", newTodo);
// Thêm công việc mới vào mảng để quản lí
todos.push(newTodo);
renderTodo(todos);


todoInputEl.value = "";
}
btnAdd.addEventListener("click", () => {
    addTodo();
})
todoInputEl.addEventListener("keydown", (event) => {
    if(event.keyCode == 13) {
        addTodo();
    }
})
// Lọc công việc theo trạng thái
Array.from(todoOptionEls).forEach(input => {
    input.addEventListener("change", async function() {
        let option = input.value;
        let todoFilter = [];
        // Gọi API 
        let res = await axios.get("/todos");
        todos = res.data;
        switch(option) {
            case "all" : {
                todoFilter = [...todos];  // spread operator
                break;
            }
            case "active" : {
            todoFilter = todos.filter(todo => todo.status == true);
            break;
            }
            case "unactive" : {
            todoFilter = todos.filter(todo => todo.status == false);
            break; 
            }
            default : {
                todoFilter = [...todos];  // spread operator
                break;
            }

        }
        renderTodo(todoFilter)
    

    })
})
// Chỉnh sửa công việc

let idUpdate = null;
const updateTodo =  async function(id) {
    let title;
    let res = await axios.get("/todos");
    todos = res.data;
    for(let i = 0; i < todos.length; i++) {
        if(todos[i].id == id) {
            title = todos[i].title;
        }
    }
    btnChange.style.display = "inline-block";
    btnAdd.style.display = "none";
    todoInputEl.value = title;
    todoInputEl.focus();
    idUpdate = id;
    
}
btnChange.addEventListener("click", async function(id) {
    let res = await axios.get("/todos");
    todos = res.data;
    for(let i = 0; i < todos.length; i++) {
        if(todos[i].id == idUpdate) {
            todos[i].title = todoInputEl.value;
        }
    }
    btnChange.style.display = "none";
    btnAdd.style.display = "inline-block";
    todoInputEl.value = "";
    renderTodo(todos);
   
})

getTodos();
