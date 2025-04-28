/**
 * Utility functions shared across To-Do List and Spending Tracker.
 */

// Theme Management
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
}

function applyTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
}

// Localization
const translations = {
    "en": {
        "english": "English",
        "nepali": "Nepali",
        // To-Do List
        "todoList": "To-Do List",
        "addTask": "Add Task",
        "taskName": "Task Name",
        "priority": "Priority",
        "low": "Low",
        "medium": "Medium",
        "high": "High",
        "dueDate": "Due Date",
        "category": "Category",
        "general": "General",
        "work": "Work",
        "personal": "Personal",
        "all": "All",
        "filterByCategory": "Filter by Category",
        "noTasks": "No tasks found.",
        "completed": "Completed",
        "actions": "Actions",
        // Spending Tracker
        "spendingTracker": "Spending Tracker",
        "addEntry": "Add Entry",
        "addSpendingEntryHeader": "Add Spending Entry",
        "addIncome": "Add Income",
        "addExpense": "Add Expense",
        "summaryReport": "Summary Report",
        "exportExcel": "Export to Excel",
        "exportPDF": "Export to PDF",
        "amount": "Amount",
        "type": "Type",
        "income": "Income",
        "expense": "Expense",
        "date": "Date",
        "recurrence": "Recurrence",
        "none": "None",
        "daily": "Daily",
        "weekly": "Weekly",
        "monthly": "Monthly",
        "currency": "Currency",
        "viewSummary": "View Summary",
        "manageEntries": "Manage Entries",
        "setBudget": "Set Budget",
        "manageCategories": "Manage Categories",
        "manageEntriesTitle": "Manage Spending Entries",
        "searchPlaceholder": "Search...",
        "filterByType": "Filter by Type",
        "filterByCategory": "Filter by Category",
        "dateRange": "Date Range",
        "startDate": "Start Date",
        "endDate": "End Date",
        "editSpendingEntry": "Edit Spending Entry",
        "stopRecurrence": "Stop Recurrence",
        "budgetTitle": "Set Monthly Budget",
        "budgetOptional": "Budget setting is optional. Click 'Save' to set budgets, or 'Cancel' to skip.",
        "budgetFor": "Budget for",
        "budgetExceeded": "Budget exceeded for {category}! Spent: {spent}, Budget: {budget}",
        "noBudgetSet": "No budgets set.",
        "weeklySummary": "Weekly Summary (Current Week, Monday to Sunday)",
        "day": "Day",
        "incomeLabel": "Income",
        "expenses": "Expenses",
        "balance": "Balance",
        "monthlySummary": "Monthly Summary",
        "yearlySummary": "Yearly Summary",
        "totalIncome": "Total Income",
        "totalExpenses": "Total Expenses",
        "netBalance": "Net Balance",
        "categoryWiseExpenses": "Category-wise Expenses",
        "monthlyTrends": "Monthly Trends (Last 6 Months)",
        "newCategory": "New Category",
        "categoryName": "Category Name",
        "addCategory": "Add Category",
        // Shopping List
        "shoppingList": "Shopping List",
        "addItem": "Add Item",
        "itemName": "Item Name",
        "quantity": "Quantity",
        "status": "Status",
        "purchased": "Purchased",
        "notPurchased": "Not Purchased",
        "filterByStatus": "Filter by Status",
        "addPurchaseExpense": "Add Purchase Expense",
        "enterAmountSpent": "Enter the amount spent on {item} ({quantity} unit(s)).",
        // Notifications
        "enableNotifications": "Enable Notifications",
        "notificationsEnabled": "Notifications are enabled.",
        "notificationsDenied": "Notification permission denied.",
        // Shared Categories
        "food": "Food",
        "rent": "Rent",
        "salary": "Salary",
        "utilities": "Utilities",
        "entertainment": "Entertainment",
        "other": "Other",
        // Shared UI Elements
        "noEntries": "No entries found.",
        "edit": "Edit",
        "delete": "Delete",
        "cancel": "Cancel",
        "save": "Save",
        "close": "Close",
        "deleteCategoryConfirm": "Are you sure you want to delete this item?"
    },
    "ne": {
        "english": "अंग्रेजी",
        "nepali": "नेपाली",
        "todoList": "कार्य सूची",
        "addTask": "कार्य थप्नुहोस्",
        "taskName": "कार्यको नाम",
        "priority": "प्राथमिकता",
        "low": "कम",
        "medium": "मध्यम",
        "high": "उच्च",
        "dueDate": "अन्तिम मिति",
        "category": "श्रेणी",
        "general": "सामान्य",
        "work": "काम",
        "personal": "व्यक्तिगत",
        "all": "सबै",
        "filterByCategory": "श्रेणी अनुसार फिल्टर गर्नुहोस्",
        "noTasks": "कुनै कार्यहरू फेला परेन।",
        "completed": "पुरा भएको",
        "actions": "कार्यहरू",
        "spendingTracker": "खर्च ट्र्याकर",
        "addEntry": "प्रविष्टि थप्नुहोस्",
        "addSpendingEntryHeader": "खर्च प्रविष्टि थप्नुहोस्",
        "addIncome": "आय थप्नुहोस्",
        "addExpense": "खर्च थप्नुहोस्",
        "summaryReport": "सारांश प्रतिवेदन",
        "exportExcel": "एक्सेलमा निर्यात गर्नुहोस्",
        "exportPDF": "PDF मा निर्यात गर्नुहोस्",
        "amount": "रकम",
        "type": "प्रकार",
        "income": "आय",
        "expense": "खर्च",
        "date": "मिति",
        "recurrence": "पुनरावृत्ति",
        "none": "कुनै पनि होइन",
        "daily": "दैनिक",
        "weekly": "साप्ताहिक",
        "monthly": "मासिक",
        "currency": "मुद्रा",
        "viewSummary": "सारांश हेर्नुहोस्",
        "manageEntries": "प्रविष्टिहरू व्यवस्थापन गर्नुहोस्",
        "setBudget": "बजेट सेट गर्नुहोस्",
        "manageCategories": "श्रेणीहरू व्यवस्थापन गर्नुहोस्",
        "manageEntriesTitle": "खर्च प्रविष्टिहरू व्यवस्थापन गर्नुहोस्",
        "searchPlaceholder": "खोज्नुहोस्...",
        "filterByType": "प्रकार अनुसार फिल्टर गर्नुहोस्",
        "filterByCategory": "श्रेणी अनुसार फिल्टर गर्नुहोस्",
        "dateRange": "मिति दायरा",
        "startDate": "सुरु मिति",
        "endDate": "अन्त्य मिति",
        "editSpendingEntry": "खर्च प्रविष्टि सम्पादन गर्नुहोस्",
        "stopRecurrence": "पुनरावृत्ति रोक्नुहोस्",
        "budgetTitle": "मासिक बजेट सेट गर्नुहोस्",
        "budgetOptional": "बजेट सेटिङ वैकल्पिक छ। बजेट सेट गर्न 'सुरक्षित गर्नुहोस्' मा क्लिक गर्नुहोस्, वा 'रद्द गर्नुहोस्' मा क्लिक गर्नुहोस्।",
        "budgetFor": "को लागि बजेट",
        "budgetExceeded": "{category} को लागि बजेट नाघ्यो! खर्च: {spent}, बजेट: {budget}",
        "noBudgetSet": "कुनै बजेट सेट गरिएको छैन।",
        "weeklySummary": "साप्ताहिक सारांश (हालको हप्ता, सोमबार देखि आइतबार)",
        "day": "दिन",
        "incomeLabel": "आय",
        "expenses": "खर्चहरू",
        "balance": "सन्तुलन",
        "monthlySummary": "मासिक सारांश",
        "yearlySummary": "वार्षिक सारांश",
        "totalIncome": "कुल आय",
        "totalExpenses": "कुल खर्च",
        "netBalance": "शुद्ध सन्तुलन",
        "categoryWiseExpenses": "श्रेणीगत खर्चहरू",
        "monthlyTrends": "मासिक प्रवृत्तिहरू (पछिल्लो ६ महिना)",
        "newCategory": "नयाँ श्रेणी",
        "categoryName": "श्रेणीको नाम",
        "addCategory": "श्रेणी थप्नुहोस्",
        "shoppingList": "किनमेल सूची",
        "addItem": "वस्तु थप्नुहोस्",
        "itemName": "वस्तुको नाम",
        "quantity": "परिमाण",
        "status": "स्थिति",
        "purchased": "खरिद गरिएको",
        "notPurchased": "खरिद नगरिएको",
        "filterByStatus": "स्थिति अनुसार फिल्टर गर्नुहोस्",
        "addPurchaseExpense": "खरिद खर्च थप्नुहोस्",
        "enterAmountSpent": "{item} मा खर्च गरिएको रकम प्रविष्ट गर्नुहोस् ({quantity} एकाइ(हरू))।",
        "enableNotifications": "सूचनाहरू सक्षम गर्नुहोस्",
        "notificationsEnabled": "सूचनाहरू सक्षम छन्।",
        "notificationsDenied": "सूचना अनुमति अस्वीकार गरियो।",
        "food": "खाना",
        "rent": "भाडा",
        "salary": "तलब",
        "utilities": "उपयोगिताहरू",
        "entertainment": "मनोरञ्जन",
        "other": "अन्य",
        "noEntries": "कुनै प्रविष्टिहरू फेला परेन।",
        "edit": "सम्पादन गर्नुहोस्",
        "delete": "हटाउनुहोस्",
        "cancel": "रद्द गर्नुहोस्",
        "save": "सुरक्षित गर्नुहोस्",
        "close": "बन्द गर्नुहोस्",
        "deleteCategoryConfirm": "के तपाईं यो वस्तु हटाउन निश्चित हुनुहुन्छ?"
    }
};

function getTranslation(key, replacements = {}) {
    const lang = localStorage.getItem("selectedLanguage") || "en";
    let translation = translations[lang][key] || translations["en"][key] || key;
    Object.keys(replacements).forEach(k => {
        translation = translation.replace(`{${k}}`, replacements[k]);
    });
    return translation;
}

function applyTranslations() {
    document.querySelectorAll("[data-translate]").forEach(element => {
        const key = element.getAttribute("data-translate");
        element.textContent = getTranslation(key);
    });
    document.querySelectorAll("[data-translate-placeholder]").forEach(element => {
        const key = element.getAttribute("data-translate-placeholder");
        element.setAttribute("placeholder", getTranslation(key));
    });
}

// Storage Utilities
function minifyJSON(data) {
    return JSON.stringify(data);
}

function parseMinifiedJSON(data) {
    return JSON.parse(data);
}

function checkStorageCapacity() {
    const testKey = "__test__";
    let testData = "";
    try {
        while (true) {
            testData += "a".repeat(1024);
            localStorage.setItem(testKey, testData);
        }
    } catch (e) {
        const usedSpaceKB = (JSON.stringify(localStorage).length / 1024);
        const usedSpace = usedSpaceKB.toFixed(2);
        const totalSpaceKB = parseFloat(usedSpace) + (testData.length / 1024);
        const totalSpace = totalSpaceKB.toFixed(2);
        console.log(`Storage: ${usedSpace} KB used out of ~${totalSpace} KB available.`);
        localStorage.removeItem(testKey);
        if (e.name === "QuotaExceededError") {
            alert("Storage limit reached! Please clear some data to continue.");
            throw new Error("Storage limit exceeded.");
        }
    }
}

// Debouncing
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
