// State Management
const state = {
    spendingEntries: [],
    shoppingItems: [],
    budgets: {},
    categories: ["Food", "Rent", "Salary", "Utilities", "Entertainment", "Other"],
};

const defaultCategories = ["Food", "Rent", "Salary", "Utilities", "Entertainment", "Other"];

let categoryPieChart, monthlyTrendsChart;

// Translation Dictionary
const translations = {
    en: {
        spendingTracker: "Spending Tracker",
        addEntry: "Add Spending Entry",
        addIncome: "Add Income",
        addExpense: "Add Expense",
        summaryReport: "Summary Report",
        exportExcel: "Export to Excel",
        exportPDF: "Export to PDF",
        amount: "Amount",
        type: "Type",
        category: "Category",
        date: "Date",
        recurrence: "Recurrence",
        currency: "Currency",
        income: "Income",
        expense: "Expense",
        food: "Food",
        rent: "Rent",
        salary: "Salary",
        utilities: "Utilities",
        entertainment: "Entertainment",
        other: "Other",
        none: "None",
        daily: "Daily",
        weekly: "Weekly",
        monthly: "Monthly",
        cancel: "Cancel",
        addSpendingEntryHeader: "Add Spending Entry",
        viewSummary: "View Summary",
        manageEntries: "Manage Entries",
        setBudget: "Set Budget",
        manageCategories: "Manage Categories",
        shoppingList: "Shopping List",
        enableNotifications: "Enable Notifications",
        budgetTitle: "Set Monthly Budget",
        budgetOptional: "Budget setting is optional. Click 'Save' to set budgets, or 'Cancel' to skip.",
        budgetFor: "Budget for",
        noBudgetSet: "No budget set.",
        weeklySummary: "Weekly Summary (Current Week, Monday to Sunday)",
        monthlySummary: "Monthly Summary",
        yearlySummary: "Yearly Summary",
        categoryWiseExpenses: "Category-wise Expenses",
        monthlyTrends: "Monthly Trends (Last 6 Months)",
        day: "Day",
        incomeLabel: "Income",
        expenses: "Expenses",
        balance: "Balance",
        totalIncome: "Total Income",
        totalExpenses: "Total Expenses",
        netBalance: "Net Balance",
        close: "Close",
        manageEntriesTitle: "Manage Spending Entries",
        searchPlaceholder: "Search by category or type",
        filterByType: "Filter by Type",
        filterByCategory: "Filter by Category",
        dateRange: "Date Range",
        startDate: "Start Date",
        endDate: "End Date",
        all: "All",
        actions: "Actions",
        editSpendingEntry: "Edit Spending Entry",
        save: "Save",
        delete: "Delete",
        newCategory: "New Category",
        categoryName: "Category Name",
        addCategory: "Add Category",
        itemName: "Item Name",
        quantity: "Quantity",
        addItem: "Add Item",
        filterByStatus: "Filter by Status",
        purchased: "Purchased",
        notPurchased: "Not Purchased",
        status: "Status",
        edit: "Edit",
        budgetExceeded: "Budget for {category} exceeded! Spent: {spent}, Budget: {budget}",
        notificationsEnabled: "Notifications are already enabled.",
        notificationsDenied: "Notification permission was denied. Please enable it in your browser settings.",
        english: "English",
        nepali: "Nepali",
    },
    ne: {
        spendingTracker: "खर्च ट्र्याकर",
        addEntry: "खर्च प्रविष्टि थप्नुहोस्",
        addIncome: "आय थप्नुहोस्",
        addExpense: "खर्च थप्नुहोस्",
        summaryReport: "सारांश प्रतिवेदन",
        exportExcel: "एक्सेलमा निर्यात गर्नुहोस्",
        exportPDF: "PDF मा निर्यात गर्नुहोस्",
        amount: "रकम",
        type: "प्रकार",
        category: "श्रेणी",
        date: "मिति",
        recurrence: "पुनरावृत्ति",
        currency: "मुद्रा",
        income: "आय",
        expense: "खर्च",
        food: "खाना",
        rent: "भाडा",
        salary: "तलब",
        utilities: "उपयोगिताहरू",
        entertainment: "मनोरञ्जन",
        other: "अन्य",
        none: "कुनै पनि होइन",
        daily: "दैनिक",
        weekly: "साप्ताहिक",
        monthly: "मासिक",
        cancel: "रद्द गर्नुहोस्",
        addSpendingEntryHeader: "खर्च प्रविष्टि थप्नुहोस्",
        viewSummary: "सारांश हेर्नुहोस्",
        manageEntries: "प्रविष्टिहरू व्यवस्थापन गर्नुहोस्",
        setBudget: "बजेट सेट गर्नुहोस्",
        manageCategories: "श्रेणीहरू व्यवस्थापन गर्नुहोस्",
        shoppingList: "किनमेल सूची",
        enableNotifications: "सूचनाहरू सक्षम गर्नुहोस्",
        budgetTitle: "मासिक बजेट सेट गर्नुहोस्",
        budgetOptional: "बजेट सेटिङ वैकल्पिक छ। बजेट सेट गर्न 'सेभ' क्लिक गर्नुहोस्, वा 'रद्द' गर्नुहोस्।",
        budgetFor: "को लागि बजेट",
        noBudgetSet: "कुनै बजेट सेट गरिएको छैन।",
        weeklySummary: "साप्ताहिक सारांश (हालको हप्ता, सोमबार देखि आइतबार)",
        monthlySummary: "मासिक सारांश",
        yearlySummary: "वार्षिक सारांश",
        categoryWiseExpenses: "श्रेणी अनुसार खर्च",
        monthlyTrends: "मासिक प्रवृत्तिहरू (पछिल्लो 6 महिना)",
        day: "दिन",
        incomeLabel: "आय",
        expenses: "खर्च",
        balance: "सन्तुलन",
        totalIncome: "कुल आय",
        totalExpenses: "कुल खर्च",
        netBalance: "शुद्ध सन्तुलन",
        close: "बन्द गर्नुहोस्",
        manageEntriesTitle: "खर्च प्रविष्टिहरू व्यवस्थापन गर्नुहोस्",
        searchPlaceholder: "श्रेणी वा प्रकार द्वारा खोजी गर्नुहोस्",
        filterByType: "प्रकार द्वारा फिल्टर गर्नुहोस्",
        filterByCategory: "श्रेणी द्वारा फिल्टर गर्नुहोस्",
        dateRange: "मिति दायरा",
        startDate: "सुरु मिति",
        endDate: "अन्त्य मिति",
        all: "सबै",
        actions: "कार्यहरू",
        editSpendingEntry: "खर्च प्रविष्टि सम्पादन गर्नुहोस्",
        save: "सेभ गर्नुहोस्",
        delete: "हटाउनुहोस्",
        newCategory: "नयाँ श्रेणी",
        categoryName: "श्रेणी नाम",
        addCategory: "श्रेणी थप्नुहोस्",
        itemName: "वस्तुको नाम",
        quantity: "मात्रा",
        addItem: "वस्तु थप्नुहोस्",
        filterByStatus: "स्थिति द्वारा फिल्टर गर्नुहोस्",
        purchased: "खरिद गरिएको",
        notPurchased: "खरिद नगरिएको",
        status: "स्थिति",
        edit: "सम्पादन गर्नुहोस्",
        budgetExceeded: "{category} को लागि बजेट नाघ्यो! खर्च: {spent}, बजेट: {budget}",
        notificationsEnabled: "सूचनाहरू पहिले नै सक्षम छन्।",
        notificationsDenied: "सूचना अनुमति अस्वीकार गरिएको छ। कृपया आफ्नो ब्राउजर सेटिङहरूमा सक्षम गर्नुहोस्।",
        english: "अंग्रेजी",
        nepali: "नेपाली",
    }
};

// Utility Functions
function getTranslation(key) {
    const lang = document.getElementById("languageToggle").value;
    return translations[lang][key];
}

function applyTranslations() {
    document.querySelectorAll("[data-translate]").forEach(elem => {
        const key = elem.getAttribute("data-translate");
        elem.textContent = getTranslation(key);
    });
    document.querySelectorAll("[data-translate-placeholder]").forEach(elem => {
        const key = elem.getAttribute("data-translate-placeholder");
        elem.placeholder = getTranslation(key);
    });
    document.querySelectorAll("select option[data-translate]").forEach(option => {
        const key = option.getAttribute("data-translate");
        option.textContent = getTranslation(key);
    });
}

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

function saveSpendingEntries() {
    try {
        if (state.spendingEntries.length > 1000) {
            state.spendingEntries = state.spendingEntries.slice(-1000);
            console.warn("Spending entries exceeded 1000; older entries have been removed.");
        }
        checkStorageCapacity();
        localStorage.setItem("spendingEntries", minifyJSON(state.spendingEntries));
    } catch (e) {
        console.error("Failed to save spending entries:", e);
        alert("Unable to save spending entries. Please check your browser settings.");
        throw e;
    }
}

function saveShoppingItems() {
    try {
        if (state.shoppingItems.length > 500) {
            state.shoppingItems = state.shoppingItems.slice(-500);
            console.warn("Shopping items exceeded 500; older items have been removed.");
        }
        checkStorageCapacity();
        localStorage.setItem("shoppingItems", minifyJSON(state.shoppingItems));
    } catch (e) {
        console.error("Failed to save shopping items:", e);
        alert("Unable to save shopping items. Please check your browser settings.");
    }
}

function saveCategories() {
    const customCategories = state.categories.filter(cat => !defaultCategories.includes(cat));
    localStorage.setItem("spendingCategories", minifyJSON(customCategories));
    populateCategoryDropdowns();
}

function checkRecurringEntries() {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    state.spendingEntries.forEach((entry, index) => {
        if (entry.recurring && entry.date && new Date(entry.date) < today) {
            let newDate = new Date(entry.date);
            while (newDate < today) {
                if (entry.recurrence === "daily") {
                    newDate.setDate(newDate.getDate() + 1);
                } else if (entry.recurrence === "weekly") {
                    newDate.setDate(newDate.getDate() + 7);
                } else if (entry.recurrence === "monthly") {
                    newDate.setMonth(newDate.getMonth() + 1);
                }
            }
            state.spendingEntries[index].date = newDate.toISOString().split("T")[0];
            if (newDate > today) {
                state.spendingEntries[index].recurring = true;
            } else {
                state.spendingEntries.push({
                    ...entry,
                    date: newDate.toISOString().split("T")[0],
                    recurring: false
                });
                state.spendingEntries[index].recurring = false;
            }
        }
    });
    saveSpendingEntries();
    setTimeout(checkRecurringEntries, 5 * 60 * 1000);
}

function convertToDefaultCurrency(amount, currency) {
    const defaultCurrency = localStorage.getItem("defaultCurrency") || "NRs";
    const exchangeRates = {
        "NRs": 1,
        "USD": 0.0074,
        "GBP": 0.0056
    };
    if (currency === defaultCurrency) return amount;
    const amountInNRs = amount / exchangeRates[currency];
    return amountInNRs * exchangeRates[defaultCurrency];
}

function populateCategoryDropdowns() {
    const dropdowns = [
        "spendingCategory",
        "editSpendingCategory",
        "filterCategory",
        "shoppingItemCategory",
        "editShoppingItemCategory",
        "filterShoppingCategory"
    ];
    dropdowns.forEach(dropdownId => {
        const dropdown = document.getElementById(dropdownId);
        if (!dropdown) return;
        const currentValue = dropdown.value;
        const options = state.categories.map(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = getTranslation(category.toLowerCase()) || category;
            return option;
        });
        dropdown.innerHTML = "";
        if (dropdownId === "filterCategory" || dropdownId === "filterShoppingCategory") {
            const allOption = document.createElement("option");
            allOption.value = "all";
            allOption.textContent = getTranslation("all");
            dropdown.appendChild(allOption);
        }
        options.forEach(option => dropdown.appendChild(option));
        dropdown.value = currentValue in state.categories ? currentValue : state.categories[0];
    });
}

// Modal Functions
function openSpendingTrackerModal(type = null) {
    const modal = new bootstrap.Modal(document.getElementById("spendingTrackerModal"));
    if (type) {
        document.getElementById("spendingType").value = type;
    }
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
                icon: 'https://cdn-icons-png.flaticon.com/32/948/948739.png' // Publicly available budget icon
            });
        } else {
            alert(message);
        }
    }
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
        categoryPieChart.data.datasets[0].backgroundColor = state.categories.map((_, i) =>
            `hsl(${(i * 360 / state.categories.length) % 360}, 70%, ${isDarkMode ? 60 : 50}%)`
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

function addShoppingItem() {
    const itemNameInput = document.getElementById("shoppingItemName");
    const itemName = DOMPurify.sanitize(itemNameInput.value.trim());
    const category = DOMPurify.sanitize(document.getElementById("shoppingItemCategory").value);
    const quantity = parseInt(document.getElementById("shoppingItemQuantity").value);

    if (!itemName) {
        itemNameInput.classList.add("is-invalid");
        return;
    }
    itemNameInput.classList.remove("is-invalid");

    try {
        state.shoppingItems.push({
            name: itemName,
            category,
            quantity,
            purchased: false
        });
        saveShoppingItems();
        displayShoppingItems();
        document.getElementById("shoppingItemName").value = "";
        document.getElementById("shoppingItemCategory").value = "Food";
        document.getElementById("shoppingItemQuantity").value = 1;
    } catch (e) {
        console.error("Failed to add shopping item:", e);
        alert("Failed to add shopping item. Please try again.");
    }
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
                <button class="btn btn-sm btn-success purchase-shopping-btn me-1" data-index="${index}" data-translate="${item.purchased ? 'notPurchased' : 'purchased'}">${item.purchased ? 'Unmark' : 'Mark Purchased'}</button>
                <button class="btn btn-sm btn-danger delete-shopping-btn" data-index="${index}" data-translate="delete">Delete</button>
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

            document.getElementById("saveEditShoppingItemBtn").onclick = () => saveEditedShoppingItem(index, modal);
        });
    });

    document.querySelectorAll(".purchase-shopping-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = btn.getAttribute("data-index");
            const item = state.shoppingItems[index];
            if (!item.purchased) {
                document.getElementById("purchaseItemInfo").textContent = `Add expense for ${item.name} (${item.quantity} units)`;
                const purchaseModal = new bootstrap.Modal(document.getElementById("addPurchaseExpenseModal"));
                purchaseModal.show();

                document.getElementById("confirmPurchaseBtn").onclick = () => {
                    const amountInput = document.getElementById("purchaseAmount");
                    const amount = parseFloat(amountInput.value);
                    if (isNaN(amount) || amount <= 0) {
                        amountInput.classList.add("is-invalid");
                        return;
                    }
                    state.spendingEntries.push({
                        amount,
                        type: "Expense",
                        category: item.category,
                        date: new Date().toISOString().split("T")[0],
                        recurrence: "none",
                        currency: localStorage.getItem("defaultCurrency") || "NRs",
                        recurring: false
                    });
                    item.purchased = true;
                    saveSpendingEntries();
                    saveShoppingItems();
                    checkBudgetAlerts(item.category);
                    displayShoppingItems();
                    purchaseModal.hide();
                };
            } else {
                item.purchased = false;
                saveShoppingItems();
                displayShoppingItems();
            }
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
}

function saveEditedShoppingItem(index, modal) {
    const itemNameInput = document.getElementById("editShoppingItemName");
    const itemName = DOMPurify.sanitize(itemNameInput.value.trim());
    if (!itemName) {
        itemNameInput.classList.add("is-invalid");
        return;
    }
    itemNameInput.classList.remove("is-invalid");

    state.shoppingItems[index] = {
        name: itemName,
        category: document.getElementById("editShoppingItemCategory").value,
        quantity: parseInt(document.getElementById("editShoppingItemQuantity").value),
        purchased: document.getElementById("editShoppingItemPurchased").checked
    };
    saveShoppingItems();
    displayShoppingItems();
    modal.hide();
}

function requestNotificationPermission() {
    if ('Notification' in window) {
        if (Notification.permission === 'granted') {
            alert(getTranslation("notificationsEnabled") || "Notifications are already enabled.");
            return;
        }
        if (Notification.permission === 'denied') {
            alert(getTranslation("notificationsDenied") || "Notification permission was denied. Please enable it in your browser settings.");
            return;
        }
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                alert(getTranslation("notificationsEnabled") || "Notification permission granted.");
            } else {
                console.log("Notification permission denied. Falling back to alerts.");
                alert(getTranslation("notificationsDenied") || "Notification permission denied. Falling back to alerts.");
            }
        }).catch(err => {
            console.error("Failed to request notification permission:", err);
            alert("Failed to request notification permission. Please try again.");
        });
    } else {
        alert("Notifications are not supported in this browser.");
    }
}

function initializeEventListeners() {
    document.getElementById("spendingTrackerBtn").addEventListener("click", openSpendingTrackerModal);
    document.getElementById("addIncomeBtn").addEventListener("click", () => openSpendingTrackerModal("Income"));
    document.getElementById("addExpenseBtn").addEventListener("click", () => openSpendingTrackerModal("Expense"));
    document.getElementById("summaryReportBtn").addEventListener("click", showSpendingSummary);
    document.getElementById("exportExcelBtn").addEventListener("click", exportSpendingToExcel);
    document.getElementById("exportPDFBtn").addEventListener("click", exportSpendingToPDF);
    document.getElementById("addSpendingBtn").addEventListener("click", addSpendingEntry);
    document.getElementById("viewSummaryBtn").addEventListener("click", showSpendingSummary);
    document.getElementById("manageEntriesBtn").addEventListener("click", showManageEntries);
    document.getElementById("setBudgetBtn").addEventListener("click", openSetBudgetModal);
    document.getElementById("manageCategoriesBtn").addEventListener("click", openManageCategoriesModal);
    document.getElementById("shoppingListBtn").addEventListener("click", openShoppingListModal);
    document.getElementById("addShoppingItemBtn").addEventListener("click", addShoppingItem);
    document.getElementById("saveEditShoppingItemBtn").addEventListener("click", saveEditedShoppingItem);
    document.getElementById("confirmPurchaseBtn").addEventListener("click", confirmPurchase);
    document.getElementById("exportSpendingExcelBtn").addEventListener("click", exportSpendingToExcel);
    document.getElementById("exportSpendingPDFBtn").addEventListener("click", exportSpendingToPDF);
    document.getElementById("saveEditSpendingBtn").addEventListener("click", saveEditedSpendingEntry);
    document.getElementById("saveBudgetBtn").addEventListener("click", saveBudgets);
    document.getElementById("addCategoryBtn").addEventListener("click", addCategory);
    document.getElementById("requestNotificationBtn").addEventListener("click", () => {
        requestNotificationPermission();
    });
    document.getElementById("themeToggleBtn").addEventListener("click", toggleTheme);
    document.getElementById("languageToggle").addEventListener("change", () => {
        const lang = document.getElementById("languageToggle").value;
        localStorage.setItem("selectedLanguage", lang);
        applyTranslations();
        populateCategoryDropdowns();
        showManageEntries();
        showSpendingSummary();
        displayShoppingItems();
    });
    document.getElementById("currencyToggle").addEventListener("change", () => {
        const currency = document.getElementById("currencyToggle").value;
        localStorage.setItem("defaultCurrency", currency);
        showManageEntries();
        showSpendingSummary();
        displayShoppingItems();
    });
    document.getElementById("searchEntries").addEventListener("input", debounce(() => {
        showManageEntries();
    }, 300));
    document.getElementById("filterType").addEventListener("change", showManageEntries);
    document.getElementById("filterCategory").addEventListener("change", showManageEntries);
    document.getElementById("filterStartDate").addEventListener("change", showManageEntries);
    document.getElementById("filterEndDate").addEventListener("change", showManageEntries);
    document.getElementById("searchShoppingItems").addEventListener("input", debounce(displayShoppingItems, 300));
    document.getElementById("filterShoppingCategory").addEventListener("change", displayShoppingItems);
    document.getElementById("filterPurchased").addEventListener("change", displayShoppingItems);

    document.querySelectorAll(".btn").forEach(btn => {
        btn.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                btn.click();
                e.preventDefault();
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    try {
        const storedSpending = localStorage.getItem("spendingEntries");
        if (storedSpending) {
            state.spendingEntries = parseMinifiedJSON(storedSpending);
        }
        const storedShoppingItems = localStorage.getItem("shoppingItems");
        if (storedShoppingItems) {
            state.shoppingItems = parseMinifiedJSON(storedShoppingItems);
        }
        const storedBudgets = localStorage.getItem("spendingBudgets");
        if (storedBudgets) {
            state.budgets = parseMinifiedJSON(storedBudgets);
        }
        const storedCategories = localStorage.getItem("spendingCategories");
        if (storedCategories) {
            const customCategories = parseMinifiedJSON(storedCategories);
            state.categories = [...defaultCategories, ...customCategories];
        }
        const storedLanguage = localStorage.getItem("selectedLanguage");
        if (storedLanguage) {
            document.getElementById("languageToggle").value = storedLanguage;
        }
        const storedCurrency = localStorage.getItem("defaultCurrency");
        if (storedCurrency) {
            document.getElementById("currencyToggle").value = storedCurrency;
        }
    } catch (e) {
        console.error("Failed to load data:", e);
        alert("Unable to load data. Please check your browser settings.");
    }
    document.getElementById("spendingDate").value = new Date().toISOString().split("T")[0];
    applyTheme();
    updateCharts();
    applyTranslations();
    initializeEventListeners();
    populateCategoryDropdowns();
    checkRecurringEntries();
});
