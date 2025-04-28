function saveEntries() {
    if (!checkStorageCapacity()) return;
    state.entryHistory.push(minifyJSON(state.spendingEntries));
    if (state.entryHistory.length > 50) state.entryHistory.shift();
    state.entryRedoStack = [];
    localStorage.setItem("spendingEntries", minifyJSON(state.spendingEntries));
}

function loadEntries() {
    const spendingList = document.getElementById("spending-list");
    const olderList = document.getElementById("older-spending-list");
    const today = new Date();
    const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    
    spendingList.innerHTML = "";
    olderList.innerHTML = "";
    
    state.spendingEntries.forEach((entry, index) => {
        const entryDate = new Date(entry.date);
        const list = entryDate >= oneMonthAgo ? spendingList : olderList;
        let itemElement = list.children[index];
        if (!itemElement) {
            itemElement = document.createElement("li");
            itemElement.className = "list-group-item d-flex justify-content-between align-items-center";
            list.appendChild(itemElement);
        }
        itemElement.innerHTML = `
            <span>${sanitizeInput(entry.category)}: ${entry.amount} ${entry.currency} (${entry.type}, ${entry.date})</span>
            <div>
                <button class="btn btn-danger btn-sm" onclick="deleteEntry(${index})" aria-label="Delete entry">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    while (spendingList.children.length > state.spendingEntries.filter(e => new Date(e.date) >= oneMonthAgo).length) {
        spendingList.removeChild(spendingList.lastChild);
    }
    while (olderList.children.length > state.spendingEntries.filter(e => new Date(e.date) < oneMonthAgo).length) {
        olderList.removeChild(olderList.lastChild);
    }
}

function addEntry(event) {
    event.preventDefault();
    const amount = parseFloat(document.getElementById("entry-amount").value);
    const type = document.getElementById("entry-type").value;
    const category = sanitizeInput(document.getElementById("entry-category").value);
    const date = document.getElementById("entry-date").value;
    const currency = document.getElementById("entry-currency").value;
    if (!amount || !category || !date) return handleError("Invalid entry.", "Please fill all required fields.");
    state.spendingEntries.push({ amount, type, category, date, currency });
    saveEntries();
    loadEntries();
    bootstrap.Modal.getInstance(document.getElementById("add-entry-modal")).hide();
    document.getElementById("entry-form").reset();
}

function addExpenseFromShopping(event) {
    event.preventDefault();
    const item = document.getElementById("expense-item").value;
    const amount = parseFloat(document.getElementById("expense-amount").value);
    const category = sanitizeInput(document.getElementById("expense-category").value);
    const date = document.getElementById("expense-date").value;
    if (!amount || !category || !date) return handleError("Invalid expense.", "Please fill all required fields.");
    state.spendingEntries.push({ amount, type: "Expense", category, date, currency: state.defaultCurrency });
    saveEntries();
    loadEntries();
    bootstrap.Modal.getInstance(document.getElementById("add-expense-modal")).hide();
    document.getElementById("expense-form").reset();
}

function deleteEntry(index) {
    state.spendingEntries.splice(index, 1);
    saveEntries();
    loadEntries();
}

function undoEntry() {
    if (state.entryHistory.length === 0) return;
    state.entryRedoStack.push(minifyJSON(state.spendingEntries));
    state.spendingEntries = parseMinifiedJSON(state.entryHistory.pop());
    localStorage.setItem("spendingEntries", minifyJSON(state.spendingEntries));
    loadEntries();
}

function redoEntry() {
    if (state.entryRedoStack.length === 0) return;
    state.entryHistory.push(minifyJSON(state.spendingEntries));
    state.spendingEntries = parseMinifiedJSON(state.entryRedoStack.pop());
    localStorage.setItem("spendingEntries", minifyJSON(state.spendingEntries));
    loadEntries();
}

function exportEntries(format) {
    const data = state.spendingEntries.map(e => ({
        Amount: e.amount,
        Type: e.type,
        Category: e.category,
        Date: e.date,
        Currency: e.currency
    }));
    if (format === "csv") {
        exportToCSV([["Amount", "Type", "Category", "Date", "Currency"], ...data.map(Object.values)], "entries.csv");
    } else if (format === "pdf") {
        exportToPDF(data, "Spending Entries", "entries.pdf");
    }
}

function importEntries(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const csv = e.target.result;
            const rows = csv.split("\n").slice(1).map(row => row.split(","));
            const importedEntries = rows.map(row => ({
                amount: parseFloat(row[0]),
                type: row[1] || "Expense",
                category: sanitizeInput(row[2]),
                date: row[3],
                currency: row[4] || state.defaultCurrency
            }));
            state.spendingEntries.push(...importedEntries);
            saveEntries();
            loadEntries();
        } catch (e) {
            handleError("Failed to import entries: " + e, "Invalid CSV file.");
        }
    };
    reader.readAsText(file);
}

document.getElementById("entry-form").addEventListener("submit", addEntry);
document.getElementById("expense-form").addEventListener("submit", addExpenseFromShopping);