// Modal Functions
        function openSpendingTrackerModal(type = null) {
            const modal = new bootstrap.Modal(document.getElementById("spendingTrackerModal"));
            if (type) {
                document.getElementById("spendingType").value = type;
            }
            modal.show();
        }

        function showSpendingSummary() {
            const budgetOverview = document.getElementById("budgetOverview");
            budgetOverview.innerHTML = "";
            if (Object.keys(state.budgets).length === 0) {
                budgetOverview.textContent = getTranslation("noBudgetSet");
            } else {
                Object.keys(state.budgets).forEach(category => {
                    const spent = calculateMonthlyExpenses(category);
                    const p = document.createElement("p");
                    p.textContent = `${getTranslation("budgetFor")} ${category}: ${state.budgets[category].toFixed(2)} ${localStorage.getItem("defaultCurrency") || "NRs"} (Spent: ${spent.toFixed(2)})`;
                    budgetOverview.appendChild(p);
                });
            }

            // Weekly Summary
            const weeklySummary = document.getElementById("weeklySummary");
            weeklySummary.innerHTML = "";
            const now = new Date();
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1));
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
            let runningBalance = 0;

            for (let i = 0; i < 7; i++) {
                const dayDate = new Date(startOfWeek);
                dayDate.setDate(startOfWeek.getDate() + i);
                const dayEntries = state.spendingEntries.filter(entry => {
                    return new Date(entry.date).toDateString() === dayDate.toDateString();
                });
                const income = dayEntries
                    .filter(entry => entry.type === "Income")
                    .reduce((sum, entry) => sum + convertToDefaultCurrency(entry.amount, entry.currency), 0);
                const expenses = dayEntries
                    .filter(entry => entry.type === "Expense")
                    .reduce((sum, entry) => sum + convertToDefaultCurrency(entry.amount, entry.currency), 0);
                runningBalance += (income - expenses);

                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${days[i]}</td>
                    <td>${income.toFixed(2)}</td>
                    <td>${expenses.toFixed(2)}</td>
                    <td>${runningBalance.toFixed(2)}</td>
                `;
                weeklySummary.appendChild(row);
            }

            // Monthly Summary
            const monthlySummary = document.getElementById("monthlySummary");
            monthlySummary.innerHTML = "";
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            const monthlyEntries = state.spendingEntries.filter(entry => {
                const entryDate = new Date(entry.date);
                return entryDate >= startOfMonth && entryDate <= endOfMonth;
            });
            const monthlyIncome = monthlyEntries
                .filter(entry => entry.type === "Income")
                .reduce((sum, entry) => sum + convertToDefaultCurrency(entry.amount, entry.currency), 0);
            const monthlyExpenses = monthlyEntries
                .filter(entry => entry.type === "Expense")
                .reduce((sum, entry) => sum + convertToDefaultCurrency(entry.amount, entry.currency), 0);
            const monthlyRow = document.createElement("tr");
            monthlyRow.innerHTML = `
                <td>${monthlyIncome.toFixed(2)}</td>
                <td>${monthlyExpenses.toFixed(2)}</td>
                <td>${(monthlyIncome - monthlyExpenses).toFixed(2)}</td>
            `;
            monthlySummary.appendChild(monthlyRow);

            // Yearly Summary
            const yearlySummary = document.getElementById("yearlySummary");
            yearlySummary.innerHTML = "";
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            const endOfYear = new Date(now.getFullYear(), 11, 31);
            const yearlyEntries = state.spendingEntries.filter(entry => {
                const entryDate = new Date(entry.date);
                return entryDate >= startOfYear && entryDate <= endOfYear;
            });
            const yearlyIncome = yearlyEntries
                .filter(entry => entry.type === "Income")
                .reduce((sum, entry) => sum + convertToDefaultCurrency(entry.amount, entry.currency), 0);
            const yearlyExpenses = yearlyEntries
                .filter(entry => entry.type === "Expense")
                .reduce((sum, entry) => sum + convertToDefaultCurrency(entry.amount, entry.currency), 0);
            const yearlyRow = document.createElement("tr");
            yearlyRow.innerHTML = `
                <td>${yearlyIncome.toFixed(2)}</td>
                <td>${yearlyExpenses.toFixed(2)}</td>
                <td>${(yearlyIncome - yearlyExpenses).toFixed(2)}</td>
            `;
            yearlySummary.appendChild(yearlyRow);

            // Charts
            if (categoryPieChart) categoryPieChart.destroy();
            if (monthlyTrendsChart) monthlyTrendsChart.destroy();

            const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark";
            const chartTextColor = isDarkMode ? "#f8f9fa" : "#212529";
            const chartBgColor = isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";

            // Category-wise Expenses (Pie Chart)
            const categoryExpenses = {};
            state.spendingEntries
                .filter(entry => entry.type === "Expense")
                .forEach(entry => {
                    const amount = convertToDefaultCurrency(entry.amount, entry.currency);
                    categoryExpenses[entry.category] = (categoryExpenses[entry.category] || 0) + amount;
                });
            categoryPieChart = new Chart(document.getElementById("categoryPieChart"), {
                type: "pie",
                data: {
                    labels: Object.keys(categoryExpenses),
                    datasets: [{
                        data: Object.values(categoryExpenses),
                        backgroundColor: Object.keys(categoryExpenses).map((_, i) =>
                            `hsl(${(i * 360 / Object.keys(categoryExpenses).length) % 360}, 70%, ${isDarkMode ? 60 : 50}%)`
                        ),
                    }]
                },
                options: {
                    plugins: {
                        legend: {
                            labels: { color: chartTextColor }
                        },
                        title: {
                            display: true,
                            text: getTranslation("categoryWiseExpenses"),
                            color: chartTextColor
                        }
                    }
                }
            });

            // Monthly Trends (Line Chart)
            const monthlyData = {};
            const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
            for (let i = 0; i < 6; i++) {
                const monthDate = new Date(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth() + i, 1);
                const monthKey = monthDate.toLocaleString('default', { month: 'short', year: 'numeric' });
                monthlyData[monthKey] = { income: 0, expenses: 0 };
            }
            state.spendingEntries.forEach(entry => {
                const entryDate = new Date(entry.date);
                if (entryDate >= sixMonthsAgo) {
                    const monthKey = entryDate.toLocaleString('default', { month: 'short', year: 'numeric' });
                    if (monthlyData[monthKey]) {
                        const amount = convertToDefaultCurrency(entry.amount, entry.currency);
                        if (entry.type === "Income") {
                            monthlyData[monthKey].income += amount;
                        } else {
                            monthlyData[monthKey].expenses += amount;
                        }
                    }
                }
            });
            monthlyTrendsChart = new Chart(document.getElementById("monthlyTrendsChart"), {
                type: "line",
                data: {
                    labels: Object.keys(monthlyData),
                    datasets: [
                        {
                            label: getTranslation("incomeLabel"),
                            data: Object.values(monthlyData).map(d => d.income),
                            borderColor: isDarkMode ? "#28a745" : "#28a745",
                            backgroundColor: isDarkMode ? "rgba(40, 167, 69, 0.2)" : "rgba(40, 167, 69, 0.2)",
                            fill: true
                        },
                        {
                            label: getTranslation("expenses"),
                            data: Object.values(monthlyData).map(d => d.expenses),
                            borderColor: isDarkMode ? "#dc3545" : "#dc3545",
                            backgroundColor: isDarkMode ? "rgba(220, 53, 69, 0.2)" : "rgba(220, 53, 69, 0.2)",
                            fill: true
                        }
                    ]
                },
                options: {
                    scales: {
                        x: {
                            title: { display: true, text: "Month", color: chartTextColor },
                            ticks: { color: chartTextColor }
                        },
                        y: {
                            title: { display: true, text: "Amount", color: chartTextColor },
                            ticks: { color: chartTextColor },
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        legend: {
                            labels: { color: chartTextColor }
                        },
                        title: {
                            display: true,
                            text: getTranslation("monthlyTrends"),
                            color: chartTextColor
                        }
                    }
                }
            });

            const modal = new bootstrap.Modal(document.getElementById("spendingSummaryModal"));
            modal.show();
        }

        function updateCharts() {
            const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark";
            const chartTextColor = isDarkMode ? "#f8f9fa" : "#212529";
            const chartBgColor = isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";

            if (categoryPieChart) {
                categoryPieChart.data.datasets[0].backgroundColor = Object.keys(categoryPieChart.data.labels).map((_, i) =>
                    `hsl(${(i * 360 / categoryPieChart.data.labels.length) % 360}, 70%, ${isDarkMode ? 60 : 50}%)`
                );
                categoryPieChart.options.plugins.legend.labels.color = chartTextColor;
                categoryPieChart.options.plugins.title.color = chartTextColor;
                categoryPieChart.update();
            }

            if (monthlyTrendsChart) {
                monthlyTrendsChart.data.datasets.forEach(dataset => {
                    dataset.borderColor = dataset.label === getTranslation("incomeLabel") ? (isDarkMode ? "#28a745" : "#28a745") : (isDarkMode ? "#dc3545" : "#dc3545");
                    dataset.backgroundColor = dataset.label === getTranslation("incomeLabel") ? (isDarkMode ? "rgba(40, 167, 69, 0.2)" : "rgba(40, 167, 69, 0.2)") : (isDarkMode ? "rgba(220, 53, 69, 0.2)" : "rgba(220, 53, 69, 0.2)");
                });
                monthlyTrendsChart.options.scales.x.title.color = chartTextColor;
                monthlyTrendsChart.options.scales.y.title.color = chartTextColor;
                monthlyTrendsChart.options.scales.x.ticks.color = chartTextColor;
                monthlyTrendsChart.options.scales.y.ticks.color = chartTextColor;
                monthlyTrendsChart.options.plugins.legend.labels.color = chartTextColor;
                monthlyTrendsChart.options.plugins.title.color = chartTextColor;
                monthlyTrendsChart.update();
            }
        }

        function showManageEntries() {
            const entriesList = document.getElementById("spendingEntriesList");
            entriesList.innerHTML = "";

            const searchQuery = document.getElementById("searchEntries").value.toLowerCase();
            const filterType = document.getElementById("filterType").value;
            const filterCategory = document.getElementById("filterCategory").value;
            const startDate = document.getElementById("filterStartDate").value;
            const endDate = document.getElementById("filterEndDate").value;

            let filteredEntries = state.spendingEntries.filter(entry => {
                const matchesSearch = entry.category.toLowerCase().includes(searchQuery) || entry.type.toLowerCase().includes(searchQuery);
                const matchesType = filterType === "all" || entry.type === filterType;
                const matchesCategory = filterCategory === "all" || entry.category === filterCategory;
                const entryDate = new Date(entry.date);
                const matchesDate = (!startDate || entryDate >= new Date(startDate)) && (!endDate || entryDate <= new Date(endDate));
                return matchesSearch && matchesType && matchesCategory && matchesDate;
            });

            filteredEntries.forEach((entry, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${entry.date}</td>
                    <td>${getTranslation(entry.type.toLowerCase())}</td>
                    <td>${entry.category}</td>
                    <td>${convertToDefaultCurrency(entry.amount, entry.currency).toFixed(2)} ${localStorage.getItem("defaultCurrency") || "NRs"}</td>
                    <td>
                        <button class="btn btn-sm btn-primary edit-spending-btn me-1" data-index="${index}" data-translate="edit">Edit</button>
                        <button class="btn btn-sm btn-danger delete-spending-btn" data-index="${index}" data-translate="delete">Delete</button>
                    </td>
                `;
                entriesList.appendChild(row);
            });

            document.querySelectorAll(".edit-spending-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const index = btn.getAttribute("data-index");
                    const entry = state.spendingEntries[index];
                    document.getElementById("editSpendingAmount").value = entry.amount;
                    document.getElementById("editSpendingType").value = entry.type;
                    document.getElementById("editSpendingCategory").value = entry.category;
                    document.getElementById("editSpendingDate").value = entry.date;
                    document.getElementById("editSpendingRecurrence").value = entry.recurrence || "none";
                    document.getElementById("editSpendingCurrency").value = entry.currency;
                    const modal = new bootstrap.Modal(document.getElementById("editSpendingModal"));
                    modal.show();

                    document.getElementById("saveEditSpendingBtn").onclick = () => {
                        const amount = parseFloat(document.getElementById("editSpendingAmount").value);
                        if (isNaN(amount) || amount <= 0) {
                            document.getElementById("editSpendingAmount").classList.add("is-invalid");
                            return;
                        }
                        state.spendingEntries[index] = {
                            amount,
                            type: document.getElementById("editSpendingType").value,
                            category: document.getElementById("editSpendingCategory").value,
                            date: document.getElementById("editSpendingDate").value,
                            recurrence: document.getElementById("editSpendingRecurrence").value,
                            currency: document.getElementById("editSpendingCurrency").value,
                            recurring: document.getElementById("editSpendingRecurrence").value !== "none"
                        };
                        saveSpendingEntries();
                        showManageEntries();
                        populateCategoryDropdowns();
                        modal.hide();
                    };
                });
            });

            document.querySelectorAll(".delete-spending-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const index = btn.getAttribute("data-index");
                    state.spendingEntries.splice(index, 1);
                    saveSpendingEntries();
                    showManageEntries();
                });
            });

            const modal = new bootstrap.Modal(document.getElementById("manageEntriesModal"));
            modal.show();
        }

        function calculateMonthlyExpenses(category) {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            return state.spendingEntries
                .filter(entry => {
                    const entryDate = new Date(entry.date);
                    return entry.type === "Expense" &&
                           entry.category === category &&
                           entryDate >= startOfMonth &&
                           entryDate <= endOfMonth;
                })
                .reduce((sum, entry) => sum + convertToDefaultCurrency(entry.amount, entry.currency), 0);
        }

        function checkBudgetAlerts(category) {
            if (!state.budgets[category]) return;
            const now = new Date();
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            const monthlyExpenses = state.spendingEntries
                .filter(entry => {
                    const entryDate = new Date(entry.date);
                    return entry.type === "Expense" &&
                           entry.category === category &&
                           entryDate >= monthStart &&
                           entryDate <= monthEnd;
                })
                .reduce((sum, entry) => sum + convertToDefaultCurrency(entry.amount, entry.currency), 0);
            if (monthlyExpenses > state.budgets[category]) {
                const message = getTranslation("budgetExceeded")
                    .replace("{category}", category)
                    .replace("{spent}", monthlyExpenses.toFixed(2))
                    .replace("{budget}", state.budgets[category].toFixed(2));
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification('Budget Alert', {
                        body: message,
                        icon: 'https://cdn-icons-png.flaticon.com/32/948/948739.png'
                    });
                } else {
                    alert(message);
                }
            }
        }

        function addSpendingEntry() {
            const amountInput = document.getElementById("spendingAmount");
            const amount = parseFloat(amountInput.value);
            if (isNaN(amount) || amount <= 0) {
                amountInput.classList.add("is-invalid");
                return;
            }
            amountInput.classList.remove("is-invalid");

            const entry = {
                amount,
                type: document.getElementById("spendingType").value,
                category: document.getElementById("spendingCategory").value,
                date: document.getElementById("spendingDate").value,
                recurrence: document.getElementById("spendingRecurrence").value,
                currency: document.getElementById("spendingCurrency").value,
                recurring: document.getElementById("spendingRecurrence").value !== "none"
            };

            try {
                state.spendingEntries.push(entry);
                saveSpendingEntries();
                checkBudgetAlerts(entry.category);
                amountInput.value = "";
                document.getElementById("spendingRecurrence").value = "none";
                const modal = bootstrap.Modal.getInstance(document.getElementById("spendingTrackerModal"));
                modal.hide();
            } catch (e) {
                console.error("Failed to add spending entry:", e);
                alert("Failed to add spending entry. Please try again.");
            }
        }

        function exportSpendingToExcel() {
            try {
                const data = state.spendingEntries.map(entry => ({
                    Date: entry.date,
                    Type: getTranslation(entry.type.toLowerCase()),
                    Category: entry.category,
                    Amount: convertToDefaultCurrency(entry.amount, entry.currency).toFixed(2),
                    Currency: localStorage.getItem("defaultCurrency") || "NRs",
                    Recurrence: entry.recurrence
                }));
                const ws = XLSX.utils.json_to_sheet(data);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Spending");
                XLSX.writeFile(wb, "Spending_Entries.xlsx");
            } catch (e) {
                console.error("Excel export failed:", e);
                alert("Failed to export to Excel. Please try again.");
            }
        }

        function exportSpendingToPDF() {
            try {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                doc.setFontSize(16);
                doc.text(getTranslation("viewSummary"), 10, 10);
                let y = 20;

                // Budget Overview
                doc.setFontSize(12);
                doc.text(getTranslation("budgetTitle"), 10, y);
                y += 10;
                if (Object.keys(state.budgets).length === 0) {
                    doc.text(getTranslation("noBudgetSet"), 10, y);
                    y += 10;
                } else {
                    Object.keys(state.budgets).forEach(category => {
                        const spent = calculateMonthlyExpenses(category);
                        doc.text(`${getTranslation("budgetFor")} ${category}: ${state.budgets[category].toFixed(2)} ${localStorage.getItem("defaultCurrency") || "NRs"} (Spent: ${spent.toFixed(2)})`, 10, y);
                        y += 10;
                    });
                }
                y += 10;

                // Weekly Summary
                doc.text(getTranslation("weeklySummary"), 10, y);
                y += 10;
                const weeklyData = [];
                const weeklyRows = document.getElementById("weeklySummary").children;
                for (let row of weeklyRows) {
                    const cells = row.children;
                    weeklyData.push([
                        cells[0].textContent,
                        cells[1].textContent,
                        cells[2].textContent,
                        cells[3].textContent
                    ]);
                }
                doc.autoTable({
                    startY: y,
                    head: [[getTranslation("day"), getTranslation("incomeLabel"), getTranslation("expenses"), getTranslation("balance")]],
                    body: weeklyData
                });
                y = doc.lastAutoTable.finalY + 10;

                // Monthly Summary
                doc.text(getTranslation("monthlySummary"), 10, y);
                y += 10;
                const monthlyData = [];
                const monthlyRows = document.getElementById("monthlySummary").children;
                for (let row of monthlyRows) {
                    const cells = row.children;
                    monthlyData.push([
                        cells[0].textContent,
                        cells[1].textContent,
                        cells[2].textContent
                    ]);
                }
                doc.autoTable({
                    startY: y,
                    head: [[getTranslation("totalIncome"), getTranslation("totalExpenses"), getTranslation("netBalance")]],
                    body: monthlyData
                });
                y = doc.lastAutoTable.finalY + 10;

                // Yearly Summary
                doc.text(getTranslation("yearlySummary"), 10, y);
                y += 10;
                const yearlyData = [];
                const yearlyRows = document.getElementById("yearlySummary").children;
                for (let row of yearlyRows) {
                    const cells = row.children;
                    yearlyData.push([
                        cells[0].textContent,
                        cells[1].textContent,
                        cells[2].textContent
                    ]);
                }
                doc.autoTable({
                    startY: y,
                    head: [[getTranslation("totalIncome"), getTranslation("totalExpenses"), getTranslation("netBalance")]],
                    body: yearlyData
                });

                doc.save("Spending_Summary.pdf");
            } catch (e) {
                console.error("PDF export failed:", e);
                alert("Failed to export to PDF. Please try again.");
            }
        }

        function openSetBudgetModal() {
            const budgetInputs = document.getElementById("budgetInputs");
            budgetInputs.innerHTML = `<p data-translate="budgetOptional">${getTranslation("budgetOptional")}</p>`;
            state.categories.forEach(category => {
                const div = document.createElement("div");
                div.className = "mb-3";
                div.innerHTML = `
                    <label for="budget-${category}" class="form-label">${getTranslation("budgetFor")} ${category}</label>
                    <input type="number" id="budget-${category}" class="form-control" value="${state.budgets[category] || ''}" min="0" step="0.01" placeholder="Enter budget for ${category}">
                `;
                budgetInputs.appendChild(div);
            });
            const modal = new bootstrap.Modal(document.getElementById("setBudgetModal"));
            modal.show();
        }

        function saveBudgets() {
            state.categories.forEach(category => {
                const budgetInput = document.getElementById(`budget-${category}`);
                const budgetValue = parseFloat(budgetInput.value);
                if (!isNaN(budgetValue) && budgetValue > 0) {
                    state.budgets[category] = budgetValue;
                } else {
                    delete state.budgets[category];
                }
            });
            localStorage.setItem("spendingBudgets", minifyJSON(state.budgets));
            const modal = bootstrap.Modal.getInstance(document.getElementById("setBudgetModal"));
            modal.hide();
        }

        function openManageCategoriesModal() {
            populateCategoryList();
            const modal = new bootstrap.Modal(document.getElementById("manageCategoriesModal"));
            modal.show();
        }

        function populateCategoryList() {
            const categoryList = document.getElementById("categoryList");
            categoryList.innerHTML = "";
            state.categories.forEach(category => {
                if (defaultCategories.includes(category)) return;
                const li = document.createElement("li");
                li.className = "list-group-item d-flex justify-content-between align-items-center";
                li.innerHTML = `
                    ${category}
                    <button class="btn btn-sm btn-danger delete-category-btn" data-category="${category}" data-translate="delete">Delete</button>
                `;
                categoryList.appendChild(li);
            });

            document.querySelectorAll(".delete-category-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const category = btn.getAttribute("data-category");
                    state.categories = state.categories.filter(cat => cat !== category);
                    state.spendingEntries.forEach(entry => {
                        if (entry.category === category) {
                            entry.category = "Other";
                        }
                    });
                    state.shoppingItems.forEach(item => {
                        if (item.category === category) {
                            item.category = "Other";
                        }
                    });
                    delete state.budgets[category];
                    saveCategories();
                    saveSpendingEntries();
                    saveShoppingItems();
                    localStorage.setItem("spendingBudgets", minifyJSON(state.budgets));
                    populateCategoryList();
                });
            });
        }

        function addCategory() {
            const newCategoryInput = document.getElementById("newCategoryInput");
            const newCategory = DOMPurify.sanitize(newCategoryInput.value.trim());
            if (!newCategory) {
                newCategoryInput.classList.add("is-invalid");
                return;
            }
            if (state.categories.includes(newCategory)) {
                alert("Category already exists.");
                return;
            }
            state.categories.push(newCategory);
            saveCategories();
            populateCategoryList();
            newCategoryInput.value = "";
            newCategoryInput.classList.remove("is-invalid");
        }

        function openShoppingListModal() {
            displayShoppingItems();
            const modal = new bootstrap.Modal(document.getElementById("shoppingListModal"));
            modal.show();
        }

        function displayShoppingItems() {
            const shoppingListItems = document.getElementById("shoppingListItems");
            shoppingListItems.innerHTML = "";

            const searchQuery = document.getElementById("searchShoppingItems").value.toLowerCase();
            const filterCategory = document.getElementById("filterShoppingCategory").value;
            const filterPurchased = document.getElementById("filterPurchased").value;

            let filteredItems = state.shoppingItems.filter(item => {
                const matchesSearch = item.name.toLowerCase().includes(searchQuery);
                const matchesCategory = filterCategory === "all" || item.category === filterCategory;
                const matchesPurchased = filterPurchased === "all" ||
                                         (filterPurchased === "purchased" && item.purchased) ||
                                         (filterPurchased === "not-purchased" && !item.purchased);
                return matchesSearch && matchesCategory && matchesPurchased;
            });

            filteredItems.forEach((item, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td class="${item.purchased ? 'shopping-item-purchased' : ''}">${item.name}</td>
                    <td>${item.category}</td>
                    <td>${item.quantity}</td>
                    <td>${item.purchased ? getTranslation("purchased") : getTranslation("notPurchased")}</td>
                    <td>
                        <button class="btn btn-sm btn-primary edit-shopping-btn me-1" data-index="${index}" data-translate="edit">Edit</button>
                        <button class="btn btn-sm btn-danger delete-shopping-btn me-1" data-index="${index}" data-translate="delete">Delete</button>
                        ${!item.purchased ? `<button class="btn btn-sm btn-success mark-purchased-btn" data-index="${index}" data-translate="purchased">Mark Purchased</button>` : ''}
                    </td>
                `;
                shoppingListItems.appendChild(row);
            });

            document.querySelectorAll(".edit-shopping-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const index = btn.getAttribute("data-index");
                    const item = state.shoppingItems[index];
                    document.getElementById("editShoppingItemName").value = item.name;
                    document.getElementById("editShoppingItemCategory").value = item.category;
                    document.getElementById("editShoppingItemQuantity").value = item.quantity;
                    document.getElementById("editShoppingItemPurchased").checked = item.purchased;
                    const modal = new bootstrap.Modal(document.getElementById("editShoppingItemModal"));
                    modal.show();

                    document.getElementById("saveEditShoppingItemBtn").onclick = () => {
                        const name = DOMPurify.sanitize(document.getElementById("editShoppingItemName").value.trim());
                        if (!name) {
                            document.getElementById("editShoppingItemName").classList.add("is-invalid");
                            return;
                        }
                        state.shoppingItems[index] = {
                            name,
                            category: document.getElementById("editShoppingItemCategory").value,
                            quantity: parseInt(document.getElementById("editShoppingItemQuantity").value),
                            purchased: document.getElementById("editShoppingItemPurchased").checked
                        };
                        saveShoppingItems();
                        displayShoppingItems();
                        modal.hide();
                    };
                });
            });

            document.querySelectorAll(".delete-shopping-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const index = btn.getAttribute("data-index");
                    state.shoppingItems.splice(index, 1);
                    saveShoppingItems();
                    displayShoppingItems();
                });
            });

            document.querySelectorAll(".mark-purchased-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const index = btn.getAttribute("data-index");
                    const item = state.shoppingItems[index];
                    document.getElementById("addPurchaseExpenseModalLabel").textContent = getTranslation("addPurchaseExpense");
                    document.getElementById("purchaseItemInfo").textContent = getTranslation("enterAmountSpent")
                        .replace("{item}", item.name)
                        .replace("{quantity}", item.quantity);
                    const modal = new bootstrap.Modal(document.getElementById("addPurchaseExpenseModal"));
                    modal.show();

                    document.getElementById("confirmPurchaseBtn").onclick = () => {
                        const amount = parseFloat(document.getElementById("purchaseAmount").value);
                        if (isNaN(amount) || amount <= 0) {
                            document.getElementById("purchaseAmount").classList.add("is-invalid");
                            return;
                        }
                        state.shoppingItems[index].purchased = true;
                        state.spendingEntries.push({
                            amount,
                            type: "Expense",
                            category: item.category,
                            date: new Date().toISOString().split("T")[0],
                            recurrence: "none",
                            currency: localStorage.getItem("defaultCurrency") || "NRs",
                            recurring: false
                        });
                        saveShoppingItems();
                        saveSpendingEntries();
                        checkBudgetAlerts(item.category);
                        displayShoppingItems();
                        modal.hide();
                    };
                });
            });
        }

        function addShoppingItem() {
            const nameInput = document.getElementById("shoppingItemName");
            const name = DOMPurify.sanitize(nameInput.value.trim());
            if (!name) {
                nameInput.classList.add("is-invalid");
                return;
            }
            nameInput.classList.remove("is-invalid");

            const item = {
                name,
                category: document.getElementById("shoppingItemCategory").value,
                quantity: parseInt(document.getElementById("shoppingItemQuantity").value),
                purchased: false
            };
            state.shoppingItems.push(item);
            saveShoppingItems();
            nameInput.value = "";
            document.getElementById("shoppingItemQuantity").value = 1;
            displayShoppingItems();
        }

        // Event Listeners
        document.addEventListener("DOMContentLoaded", () => {
            // Load saved data
            const savedEntries = localStorage.getItem("spendingEntries");
            if (savedEntries) {
                state.spendingEntries = parseMinifiedJSON(savedEntries);
            }

            const savedShoppingItems = localStorage.getItem("shoppingItems");
            if (savedShoppingItems) {
                state.shoppingItems = parseMinifiedJSON(savedShoppingItems);
            }

            const savedCategories = localStorage.getItem("spendingCategories");
            if (savedCategories) {
                const customCategories = parseMinifiedJSON(savedCategories);
                state.categories = [...defaultCategories, ...customCategories];
            }

            const savedBudgets = localStorage.getItem("spendingBudgets");
            if (savedBudgets) {
                state.budgets = parseMinifiedJSON(savedBudgets);
            }

            // Apply theme and translations
            applyTheme();
            applyTranslations();
            populateCategoryDropdowns();

            // Set default dates
            const today = new Date().toISOString().split("T")[0];
            document.getElementById("spendingDate").value = today;
            document.getElementById("editSpendingDate").value = today;

            // Currency toggle
            const savedCurrency = localStorage.getItem("defaultCurrency") || "NRs";
            document.getElementById("currencyToggle").value = savedCurrency;
            document.getElementById("spendingCurrency").value = savedCurrency;
            document.getElementById("editSpendingCurrency").value = savedCurrency;

            document.getElementById("currencyToggle").addEventListener("change", () => {
                const newCurrency = document.getElementById("currencyToggle").value;
                localStorage.setItem("defaultCurrency", newCurrency);
                document.getElementById("spendingCurrency").value = newCurrency;
                document.getElementById("editSpendingCurrency").value = newCurrency;
                showManageEntries();
                showSpendingSummary();
                displayShoppingItems();
            });

            // Language toggle
            document.getElementById("languageToggle").addEventListener("change", () => {
                applyTranslations();
                populateCategoryDropdowns();
                if (categoryPieChart) {
                    categoryPieChart.options.plugins.title.text = getTranslation("categoryWiseExpenses");
                    categoryPieChart.update();
                }
                if (monthlyTrendsChart) {
                    monthlyTrendsChart.options.plugins.title.text = getTranslation("monthlyTrends");
                    monthlyTrendsChart.data.datasets[0].label = getTranslation("incomeLabel");
                    monthlyTrendsChart.data.datasets[1].label = getTranslation("expenses");
                    monthlyTrendsChart.update();
                }
                // Refresh open modals
                if (bootstrap.Modal.getInstance(document.getElementById("manageEntriesModal"))?.isShown) {
                    showManageEntries();
                }
                if (bootstrap.Modal.getInstance(document.getElementById("shoppingListModal"))?.isShown) {
                    displayShoppingItems();
                }
            });

            // Theme toggle
            document.getElementById("themeToggleBtn").addEventListener("click", () => {
                toggleTheme();
                updateCharts();
            });

            // Spending Tracker Modal
            document.getElementById("spendingTrackerBtn").addEventListener("click", () => openSpendingTrackerModal());
            document.getElementById("addIncomeBtn").addEventListener("click", () => openSpendingTrackerModal("Income"));
            document.getElementById("addExpenseBtn").addEventListener("click", () => openSpendingTrackerModal("Expense"));
            document.getElementById("addSpendingBtn").addEventListener("click", addSpendingEntry);

            // Summary Report
            document.getElementById("summaryReportBtn").addEventListener("click", showSpendingSummary);
            document.getElementById("exportSpendingExcelBtn").addEventListener("click", exportSpendingToExcel);
            document.getElementById("exportSpendingPDFBtn").addEventListener("click", exportSpendingToPDF);

            // Export Buttons
            document.getElementById("exportExcelBtn").addEventListener("click", exportSpendingToExcel);
            document.getElementById("exportPDFBtn").addEventListener("click", exportSpendingToPDF);

            // Manage Entries
            document.getElementById("manageEntriesBtn").addEventListener("click", showManageEntries);
            document.getElementById("searchEntries").addEventListener("input", debounce(showManageEntries, 300));
            document.getElementById("filterType").addEventListener("change", showManageEntries);
            document.getElementById("filterCategory").addEventListener("change", showManageEntries);
            document.getElementById("filterStartDate").addEventListener("change", showManageEntries);
            document.getElementById("filterEndDate").addEventListener("change", showManageEntries);

            // Set Budget
            document.getElementById("setBudgetBtn").addEventListener("click", openSetBudgetModal);
            document.getElementById("saveBudgetBtn").addEventListener("click", saveBudgets);

            // Manage Categories
            document.getElementById("manageCategoriesBtn").addEventListener("click", openManageCategoriesModal);
            document.getElementById("addCategoryBtn").addEventListener("click", addCategory);

            // Shopping List
            document.getElementById("shoppingListBtn").addEventListener("click", openShoppingListModal);
            document.getElementById("addShoppingItemBtn").addEventListener("click", addShoppingItem);
            document.getElementById("searchShoppingItems").addEventListener("input", debounce(displayShoppingItems, 300));
            document.getElementById("filterShoppingCategory").addEventListener("change", displayShoppingItems);
            document.getElementById("filterPurchased").addEventListener("change", displayShoppingItems);

            // Notifications
            document.getElementById("requestNotificationBtn").addEventListener("click", () => {
                if ('Notification' in window) {
                    if (Notification.permission === 'granted') {
                        alert(getTranslation("notificationsEnabled"));
                    } else if (Notification.permission !== 'denied') {
                        Notification.requestPermission().then(permission => {
                            if (permission === 'granted') {
                                alert("Notifications enabled!");
                            } else {
                                alert(getTranslation("notificationsDenied"));
                            }
                        });
                    } else {
                        alert(getTranslation("notificationsDenied"));
                    }
                } else {
                    alert("Notifications are not supported in this browser.");
                }
            });

            // Start recurring entries check
            checkRecurringEntries();
        });
