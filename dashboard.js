function loadDashboard() {
    const tasks = state.tasks.filter(t => !t.completed && t.date && new Date(t.date) <= new Date());
    const recentEntries = state.spendingEntries.slice(-5);
    const pendingItems = state.shoppingItems.filter(i => !i.purchased);
    
    document.getElementById("expense-item").innerHTML = '<option value="">Select Item</option>' + 
        state.shoppingItems.map(item => `<option value="${item.text}">${item.text}</option>`).join("");
    
    document.getElementById("dashboard-content").innerHTML = `
        <div class="card mb-3">
            <div class="card-body">
                <h5>Upcoming Tasks (${tasks.length})</h5>
                <ul class="list-group">
                    ${tasks.slice(0, 3).map(t => `<li class="list-group-item">${sanitizeInput(t.text)} (${t.date})</li>`).join("")}
                </ul>
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <h5>Recent Expenses (${recentEntries.length})</h5>
                <ul class="list-group">
                    ${recentEntries.map(e => `<li class="list-group-item">${sanitizeInput(e.category)}: ${e.amount} ${e.currency}</li>`).join("")}
                </ul>
            </div>
        </div>
        <div class="card">
            <div class="card-body">
                <h5>Shopping List (${pendingItems.length} pending)</h5>
                <ul class="list-group">
                    ${pendingItems.slice(0, 3).map(i => `<li class="list-group-item">${sanitizeInput(i.text)} (Qty: ${i.quantity})</li>`).join("")}
                </ul>
            </div>
        </div>
    `;
}