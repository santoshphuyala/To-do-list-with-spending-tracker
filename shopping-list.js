function saveItems() {
    if (!checkStorageCapacity()) return;
    state.itemHistory.push(minifyJSON(state.shoppingItems));
    if (state.itemHistory.length > 50) state.itemHistory.shift();
    state.itemRedoStack = [];
    localStorage.setItem("shoppingItems", minifyJSON(state.shoppingItems));
}

function loadItems() {
    const shoppingList = document.getElementById("shopping-list");
    const purchasedList = document.getElementById("purchased-list");
    
    shoppingList.innerHTML = "";
    purchasedList.innerHTML = "";
    
    state.shoppingItems.forEach((item, index) => {
        const list = item.purchased ? purchasedList : shoppingList;
        let itemElement = list.children[index];
        if (!itemElement) {
            itemElement = document.createElement("li");
            itemElement.className = "list-group-item d-flex justify-content-between align-items-center";
            list.appendChild(itemElement);
        }
        itemElement.innerHTML = `
            <span>${sanitizeInput(item.text)} (Qty: ${item.quantity})</span>
            <div>
                <button class="btn btn-success btn-sm me-2" onclick="markPurchased(${index})" aria-label="Mark purchased">
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-warning btn-sm me-2" onclick="editItem(${index})" aria-label="Edit item">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteItem(${index})" aria-label="Delete item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    while (shoppingList.children.length > state.shoppingItems.filter(i => !i.purchased).length) {
        shoppingList.removeChild(shoppingList.lastChild);
    }
    while (purchasedList.children.length > state.shoppingItems.filter(i => i.purchased).length) {
        purchasedList.removeChild(purchasedList.lastChild);
    }
}

function addItem(event) {
    event.preventDefault();
    const text = sanitizeInput(document.getElementById("item-text").value);
    const quantity = parseInt(document.getElementById("item-quantity").value) || 1;
    if (!text) return handleError("Item text is empty.", "Please enter an item.");
    state.shoppingItems.push({ text, quantity, purchased: false });
    saveItems();
    loadItems();
    bootstrap.Modal.getInstance(document.getElementById("add-item-modal")).hide();
    document.getElementById("item-form").reset();
}

function markPurchased(index) {
    state.shoppingItems[index].purchased = true;
    saveItems();
    const item = state.shoppingItems[index];
    if (confirm("Add this purchase to Spending Tracker?")) {
        document.getElementById("expense-item").innerHTML = `<option value="${item.text}">${item.text}</option>`;
        document.getElementById("expense-date").value = new Date().toISOString().split("T")[0];
        bootstrap.Modal.getOrCreateInstance(document.getElementById("add-expense-modal")).show();
    }
    loadItems();
}

function editItem(index) {
    const item = state.shoppingItems[index];
    document.getElementById("item-text").value = item.text;
    document.getElementById("item-quantity").value = item.quantity;
    deleteItem(index);
    bootstrap.Modal.getOrCreateInstance(document.getElementById("add-item-modal")).show();
}

function deleteItem(index) {
    state.shoppingItems.splice(index, 1);
    saveItems();
    loadItems();
}

function undoItem() {
    if (state.itemHistory.length === 0) return;
    state.itemRedoStack.push(minifyJSON(state.shoppingItems));
    state.shoppingItems = parseMinifiedJSON(state.itemHistory.pop());
    localStorage.setItem("shoppingItems", minifyJSON(state.shoppingItems));
    loadItems();
}

function redoItem() {
    if (state.itemRedoStack.length === 0) return;
    state.itemHistory.push(minifyJSON(state.shoppingItems));
    state.shoppingItems = parseMinifiedJSON(state.itemRedoStack.pop());
    localStorage.setItem("shoppingItems", minifyJSON(state.shoppingItems));
    loadItems();
}

function exportItems(format) {
    const data = state.shoppingItems.map(i => ({
        Item: i.text,
        Quantity: i.quantity,
        Purchased: i.purchased
    }));
    if (format === "csv") {
        exportToCSV([["Item", "Quantity", "Purchased"], ...data.map(Object.values)], "items.csv");
    } else if (format === "pdf") {
        exportToPDF(data, "Shopping List", "items.pdf");
    }
}

function importItems(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const csv = e.target.result;
            const rows = csv.split("\n").slice(1).map(row => row.split(","));
            const importedItems = rows.map(row => ({
                text: sanitizeInput(row[0]),
                quantity: parseInt(row[1]) || 1,
                purchased: row[2] === "true"
            }));
            state.shoppingItems.push(...importedItems);
            saveItems();
            loadItems();
        } catch (e) {
            handleError("Failed to import items: " + e, "Invalid CSV file.");
        }
    };
    reader.readAsText(file);
}

document.getElementById("item-form").addEventListener("submit", addItem);