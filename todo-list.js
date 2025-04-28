function saveTasks() {
    if (!checkStorageCapacity()) return;
    state.taskHistory.push(minifyJSON(state.tasks));
    if (state.taskHistory.length > 50) state.taskHistory.shift();
    state.taskRedoStack = [];
    localStorage.setItem("tasks", minifyJSON(state.tasks));
}

function loadTasks() {
    const taskList = document.getElementById("task-list");
    const completedList = document.getElementById("completed-task-list");
    const linkSelect = document.getElementById("task-link");
    linkSelect.innerHTML = '<option value="">None</option>' + 
        state.shoppingItems.map(item => `<option value="${item.text}">${item.text}</option>`).join("");
    
    taskList.innerHTML = "";
    completedList.innerHTML = "";
    
    state.tasks.forEach((task, index) => {
        const list = task.completed ? completedList : taskList;
        let itemElement = list.children[index];
        if (!itemElement) {
            itemElement = document.createElement("li");
            itemElement.className = "list-group-item d-flex justify-content-between align-items-center";
            list.appendChild(itemElement);
        }
        itemElement.innerHTML = `
            <span>${sanitizeInput(task.text)} ${task.date ? `(${task.date})` : ""} ${task.link ? `<a href="#shopping-list" onclick="showSection('shopping-list')">[${task.link}]</a>` : ""}</span>
            <div>
                <button class="btn btn-success btn-sm me-2" onclick="toggleTask(${index})" aria-label="Toggle completion">
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteTask(${index})" aria-label="Delete task">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    while (taskList.children.length > state.tasks.filter(t => !t.completed).length) {
        taskList.removeChild(taskList.lastChild);
    }
    while (completedList.children.length > state.tasks.filter(t => t.completed).length) {
        completedList.removeChild(completedList.lastChild);
    }
}

function addTask(event) {
    event.preventDefault();
    const text = sanitizeInput(document.getElementById("task-text").value);
    const date = document.getElementById("task-date").value;
    const link = document.getElementById("task-link").value;
    if (!text) return handleError("Task text is empty.", "Please enter a task.");
    state.tasks.push({ text, date, completed: false, link });
    saveTasks();
    loadTasks();
    bootstrap.Modal.getInstance(document.getElementById("add-task-modal")).hide();
    document.getElementById("task-form").reset();
}

function toggleTask(index) {
    state.tasks[index].completed = !state.tasks[index].completed;
    saveTasks();
    loadTasks();
}

function deleteTask(index) {
    state.tasks.splice(index, 1);
    saveTasks();
    loadTasks();
}

function undoTask() {
    if (state.taskHistory.length === 0) return;
    state.taskRedoStack.push(minifyJSON(state.tasks));
    state.tasks = parseMinifiedJSON(state.taskHistory.pop());
    localStorage.setItem("tasks", minifyJSON(state.tasks));
    loadTasks();
}

function redoTask() {
    if (state.taskRedoStack.length === 0) return;
    state.taskHistory.push(minifyJSON(state.tasks));
    state.tasks = parseMinifiedJSON(state.taskRedoStack.pop());
    localStorage.setItem("tasks", minifyJSON(state.tasks));
    loadTasks();
}

function exportTasks(format) {
    const data = state.tasks.map(t => ({
        Text: t.text,
        Date: t.date || "",
        Completed: t.completed,
        LinkedItem: t.link || ""
    }));
    if (format === "csv") {
        exportToCSV([["Text", "Date", "Completed", "LinkedItem"], ...data.map(Object.values)], "tasks.csv");
    } else if (format === "pdf") {
        exportToPDF(data, "Tasks", "tasks.pdf");
    }
}

function importTasks(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const csv = e.target.result;
            const rows = csv.split("\n").slice(1).map(row => row.split(","));
            const importedTasks = rows.map(row => ({
                text: sanitizeInput(row[0]),
                date: row[1] || "",
                completed: row[2] === "true",
                link: row[3] || ""
            }));
            state.tasks.push(...importedTasks);
            saveTasks();
            loadTasks();
        } catch (e) {
            handleError("Failed to import tasks: " + e, "Invalid CSV file.");
        }
    };
    reader.readAsText(file);
}

document.getElementById("task-form").addEventListener("submit", addTask);