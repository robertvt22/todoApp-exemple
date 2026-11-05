import "./style.css";

import "./style.css";

/*  ↓ SELECTORI ↓ */

const btnPrevDate = document.querySelector(".btn-arrowLeft");
const btnNextDate = document.querySelector(".btn-arrowRight");
const todoDate = document.querySelector(".todo-date");
const btnAddTask = document.querySelector(".btn-add");
const checkTaskList = document.querySelector(".bottom-main");

/*  ↑ SELECTORI ↑ */
/* --------------------------------------------- */

/*  ↓ CALENDAR ↓ */

let currentDate = new Date();

function formatDate(date = currentDate) {
    return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function getDateKey(date = currentDate) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function updateDate() {
    todoDate.textContent = formatDate(currentDate);
}

btnPrevDate.addEventListener("click", () => {
    saveTasks();
    currentDate.setDate(currentDate.getDate() - 1);
    updateDate();
    loadTasks();
    countTaskAll();
    countDoneTasks();
});

btnNextDate.addEventListener("click", () => {
    saveTasks();
    currentDate.setDate(currentDate.getDate() + 1);
    updateDate();
    loadTasks();
    countTaskAll();
    countDoneTasks();
});

/*  ↑ CALENDAR ↑ */
/* --------------------------------------------- */

/*  ↓ NEW ELEMENT ↓ */

function newElement() {
    const inputTask = document.querySelector(".todo-input");
    const inputValue = inputTask.value.trim();

    if (!inputValue) {
        alert("Write some task!");
        return;
    }

    const newDiv = document.createElement("div");
    newDiv.classList.add("todo-content");

    newDiv.innerHTML = `
        <button type="button" class="btn-iconCheck">
            <i class="fa-solid fa-check"></i>
        </button>
        <h2 class="todo-task">${inputValue}</h2>
        <button type="button" class="btn-iconDelete">
            <i class="fa-solid fa-trash"></i>
        </button>
    `;

    document.querySelector(".bottom-main").appendChild(newDiv);
    inputTask.value = "";

    countTaskAll();
    countDoneTasks();
    saveTasks();
}

btnAddTask.addEventListener("click", newElement);

/*  ↑ NEW ELEMENT ↑ */
/* --------------------------------------------- */

/*  ↓ CHECK & DELETE BUTTON ↓ */

checkTaskList.addEventListener("click", (e) => {
    const btnCheck = e.target.closest(".btn-iconCheck");

    if (btnCheck) {
        const taskItemCheck = btnCheck.closest(".todo-content");
        if (!taskItemCheck) return;

        taskItemCheck.classList.toggle("completed");
        countTaskAll();
        countDoneTasks();
        saveTasks();
        return;
    }

    const btnDelete = e.target.closest(".btn-iconDelete");

    if (btnDelete) {
        const taskItemDelete = btnDelete.closest(".todo-content");
        if (!taskItemDelete || !taskItemDelete.classList.contains("completed")) return;

        taskItemDelete.remove();
        countTaskAll();
        countDoneTasks();
        saveTasks();
    }
});

/*  ↑ CHECK & DELETE BUTTON ↑ */
/* --------------------------------------------- */

/*  ↓ COUNT TASK ALL ↓ */

function countTaskAll() {
    const todoTaskAll = document.querySelectorAll(".todo-content");
    const taskNumberAll = document.querySelector(".todo-taskAll");

    if (taskNumberAll) {
        taskNumberAll.textContent = todoTaskAll.length;
    }
}

/*  ↑ COUNT TASK ALL ↑ */
/* --------------------------------------------- */

/*  ↓ COUNT TASK DONE ↓ */

function countDoneTasks() {
    const todoTaskDone = document.querySelectorAll(".todo-content");
    let doneCount = 0;

    todoTaskDone.forEach((task) => {
        if (task.classList.contains("completed")) doneCount++;
    });

    const taskNumberDone = document.querySelector(".todo-taskDone");
    if (taskNumberDone) {
        taskNumberDone.textContent = doneCount;
    }
}

/*  ↑ COUNT TASK DONE ↑ */
/* --------------------------------------------- */

/*  ↓ SAVE TASKS ↓ */

function saveTasks() {
    const taskElements = document.querySelectorAll(".todo-content");
    const tasks = [];

    taskElements.forEach((item) => {
        const text = item.querySelector(".todo-task").textContent;
        const isCompleted = item.classList.contains("completed");
        tasks.push({ text, completed: isCompleted });
    });

    const allTasks = JSON.parse(localStorage.getItem("myTasksByDate") || "{}");
    allTasks[getDateKey()] = tasks;
    localStorage.setItem("myTasksByDate", JSON.stringify(allTasks));
}

/*  ↑ SAVE TASKS ↑ */
/* --------------------------------------------- */

/*  ↓ LOAD TASKS ↓ */

function loadTasks() {
    try {
        const allTasks = JSON.parse(localStorage.getItem("myTasksByDate") || "{}");
        const dayTasks = allTasks[getDateKey()] || [];

        const todoList = document.querySelector(".bottom-main");
        todoList.innerHTML = "";

        dayTasks.forEach((taskObj) => {
            const newDiv = document.createElement("div");
            newDiv.classList.add("todo-content");

            if (taskObj.completed) {
                newDiv.classList.add("completed");
            }

            newDiv.innerHTML = `
                <button type="button" class="btn-iconCheck">
                    <i class="fa-solid fa-check"></i>
                </button>
                <h2 class="todo-task">${taskObj.text}</h2>
                <button type="button" class="btn-iconDelete">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;

            todoList.appendChild(newDiv);
        });
    } catch (error) {
        console.error("Eroare la citirea din localStorage:", error);
        localStorage.removeItem("myTasksByDate");
    }
}

/*  ↑ LOAD TASKS ↑ */
/* --------------------------------------------- */

/*  ↓ INIT ↓ */

updateDate();
loadTasks();
countTaskAll();
countDoneTasks();

const btnCalendar = document.getElementById("btnCalendar");
const hiddenDate = document.getElementById("hiddenDate");

btnCalendar.addEventListener("click", () => {
    // deschide calendarul nativ
    if (typeof hiddenDate.showPicker === "function") {
        hiddenDate.showPicker();
    } else {
        hiddenDate.click(); // fallback
    }
});

hiddenDate.addEventListener("change", () => {
    // hiddenDate.value vine ca "2026-11-04"
    const [y, m, d] = hiddenDate.value.split("-").map(Number);
    currentDate = new Date(y, m - 1, d);

    updateDate();
    loadTasks();
    countTaskAll();
    countDoneTasks();
});
