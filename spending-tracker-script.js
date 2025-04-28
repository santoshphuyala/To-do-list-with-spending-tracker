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
                budgetOverview.textContent = "No budget set.";
            } else {
                Object.keys(state.budgets).forEach(category => {
                    const spent = calculateMonthlyExpenses(category);
                    const p = document.createElement("p");
                    p.textContent = `Budget for ${category}: ${state.budgets[category].toFixed(2)} ${localStorage.getItem("defaultCurrency") || "NRs"} (Spent: ${spent.toFixed(2)})`;
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
                            text: "Category-wise Expenses",
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
                            label: "Income",
                            data: Object.values(monthlyData).map(d => d.income),
                            borderColor: isDarkMode ? "#28a745" : "#28a745",
                            backgroundColor: isDarkMode ? "rgba(40, 167, 69, 0.2)" : "rgba(40, 167, 69, 0.2)",
                            fill: true
                        },
                        {
                            label: "Expenses",
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
                            text: "Monthly Trends",
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
                    dataset.borderColor = dataset.label === "Income" ? (isDarkMode ? "#28a745" : "#28a745") : (isDarkMode ? "#dc3545" : "#dc3545");
                    dataset.backgroundColor = dataset.label === "Income" ? (isDarkMode ? "rgba(40, 167, 69, 0.2)" : "rgba(40, 167, 69, 0.2)") : (isDarkMode ? "rgba(220, 53, 69, 0.2)" : "rgba(220, 53, 69, 0.2)");
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
                    <td>${entry.type}</td>
                    <td>${entry.category}</td>
                    <td>${convertToDefaultCurrency(entry.amount, entry.currency).toFixed(2)} ${localStorage.getItem("defaultCurrency") || "NRs"}</td>
                    <td>
                        <button class="btn btn-sm btn-primary edit-spending-btn me-1">Edit</button>
                        <button class="btn btn-sm btn-danger delete-spending-btn">Delete</button>
                    </td>
                `;
                entriesList.appendChild(row);
            });

            document.querySelectorAll(".edit-spending-btn").forEach((btn, idx) => {
                btn.addEventListener("click", () => {
                    const index = filteredEntries[idx];
                    const entry = state.spendingEntries[state.spendingEntries.indexOf(index)];
                    document.getElementById("editSpendingAmount").value = entry.amount;
                    document.getElementById("editSpendingType").value = entry.type;
                    document.getElementById("editSpendingCategory").value = entry.category;
                    document.getElementById("editSpendingDate").value = entry.date;
                    document.getElementById("editSpendingCurrency").value = entry.currency;
                    const modal = new bootstrap.Modal(document.getElementById("editSpendingModal"));
                    modal.show();

                    document.getElementById("saveEditSpendingBtn").onclick = () => {
                        const amount = parseFloat(document.getElementById("editSpendingAmount").value);
                        if (isNaN(amount) || amount <= 0) {
                            document.getElementById("editSpendingAmount").classList.add("is-invalid");
                            return;
                        }
                        const index = state.spendingEntries.indexOf(entry);
                        state.spendingEntries[index] = {
                            amount,
                            type: document.getElementById("editSpendingType").value,
                            category: document.getElementById("editSpendingCategory").value,
                            date: document.getElementById("editSpendingDate").value,
                            currency: document.getElementById("editSpendingCurrency").value
                        };
                        saveSpendingEntries();
                        showManageEntries();
                        populateCategoryDropdowns();
                        modal.hide();
                    };
                });
            });

            document.querySelectorAll(".delete-spending-btn").forEach((btn, idx) => {
                btn.addEventListener("click", () => {
                    const entry = filteredEntries[idx];
                    const index = state.spendingEntries.indexOf(entry);
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
                currency: document.getElementById("spendingCurrency").value
            };

            try {
                state.spendingEntries.push(entry);
                saveSpendingEntries();
                amountInput.value = "";
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
                    Type: entry.type,
                    Category: entry.category,
                    Amount: convertToDefaultCurrency(entry.amount, entry.currency).toFixed(2),
                    Currency: localStorage.getItem("defaultCurrency") || "NRs"
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
                doc.text("View Summary", 10, 10);
                let y = 20;

                // Budget Overview
                doc.setFontSize(12);
                doc.text("Set Monthly Budget", 10, y);
                y += 10;
                if (Object.keys(state.budgets).length === 0) {
                    doc.text("No budget set.", 10, y);
                    y += 10;
                } else {
                    Object.keys(state.budgets).forEach(category => {
                        const spent = calculateMonthlyExpenses(category);
                        doc.text(`Budget for ${category}: ${state.budgets[category].toFixed(2)} ${localStorage.getItem("defaultCurrency") || "NRs"} (Spent: ${spent.toFixed(2)})`, 10, y);
                        y += 10;
                    });
                }
                y += 10;

                // Weekly Summary
                doc.text("Weekly Summary", 10, y);
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
                    head: [["Day", "Income", "Expenses", "Balance"]],
                    body: weeklyData
                });
                y = doc.lastAutoTable.finalY + 10;

                // Monthly Summary
                doc.text("Monthly Summary", 10, y);
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
                    head: [["Total Income", "Total Expenses", "Net Balance"]],
                    body: monthlyData
                });
                y = doc.lastAutoTable.finalY + 10;

                // Yearly Summary
                doc.text("Yearly Summary", 10, y);
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
                    head: [["Total Income", "Total Expenses", "Net Balance"]],
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
            budgetInputs.innerHTML = `<p>Budgets are optional. Leave blank to remove.</p>`;
            state.categories.forEach(category => {
                const div = document.createElement("div");
                div.className = "mb-3";
                div.innerHTML = `
                    <label for="budget-${category}" class="form-label">Budget for ${category}</label>
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
                    <button class="btn btn-sm btn-danger delete-category-btn" data-category="${category}">Delete</button>
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
                    delete state.budgets[category];
                    saveCategories();
                    saveSpendingEntries();
                    localStorage.setItem("spendingBudgets", minifyJSON(state.budgets));
                    populateCategoryList();
                });
            });
        }

        function saveCategories() {
            const customCategories = state.categories.filter(cat => !defaultCategories.includes(cat));
            localStorage.setItem("spendingCategories", minifyJSON(customCategories));
            populateCategoryDropdowns();
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

        // Event Listeners
        document.addEventListener("DOMContentLoaded", () => {
            // Load saved data
            const savedEntries = localStorage.getItem("spendingEntries");
            if (savedEntries) {
                state.spendingEntries = parseMinifiedJSON(savedEntries);
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

            // Apply theme
            applyTheme();
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
        });