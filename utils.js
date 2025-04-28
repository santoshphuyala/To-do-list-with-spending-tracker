// utils.js
// Theme functions (unchanged)
function applyTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        themeToggleBtn.textContent = savedTheme === 'dark' ? 'Toggle Light Mode' : 'Toggle Dark Mode';
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        themeToggleBtn.textContent = newTheme === 'dark' ? 'Toggle Light Mode' : 'Toggle Dark Mode';
    }
    const todoIframe = document.getElementById('todoIframe');
    const spendingIframe = document.getElementById('spendingIframe');
    if (todoIframe) {
        todoIframe.contentWindow.postMessage({ theme: newTheme }, '*');
    }
    if (spendingIframe) {
        spendingIframe.contentWindow.postMessage({ theme: newTheme }, '*');
    }
}

// LocalStorage utilities (unchanged)
function minifyJSON(data) {
    return JSON.stringify(data);
}

function parseMinifiedJSON(data) {
    return JSON.parse(data);
}

function checkStorageCapacity() {
    const STORAGE_LIMIT = 5 * 1024 * 1024; // 5MB assumed localStorage limit
    const STORAGE_WARNING_THRESHOLD = 0.9; // Warn at 90% capacity
    let total = 0;
    for (let x in localStorage) {
        if (localStorage.hasOwnProperty(x)) {
            total += ((localStorage[x].length + x.length) * 2);
        }
    }
    if (total > STORAGE_LIMIT * STORAGE_WARNING_THRESHOLD) {
        alert('Warning: Local storage is nearing capacity. Consider backing up and clearing data.');
    }
}

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Localization
const translations = {
    en: {
        spendingTracker: "Spending Tracker",
        addEntry: "Add Entry",
        viewSummary: "View Summary",
        manageEntries: "Manage Entries",
        amount: "Amount",
        type: "Type",
        category: "Category",
        date: "Date",
        income: "Income",
        expense: "Expense",
        food: "Food",
        rent: "Rent",
        salary: "Salary",
        utilities: "Utilities",
        entertainment: "Entertainment",
        other: "Other",
        cancel: "Cancel",
        save: "Save",
        exportExcel: "Export to Excel",
        exportPDF: "Export to PDF",
        close: "Close",
        weeklySummary: "Weekly Summary (Current Week, Monday to Sunday)",
        day: "Day",
        incomeLabel: "Income",
        expenses: "Expenses",
        balance: "Balance",
        monthlySummary: "Monthly Summary",
        yearlySummary: "Yearly Summary",
        totalIncome: "Total Income",
        totalExpenses: "Total Expenses",
        netBalance: "Net Balance",
        manageEntriesTitle: "Manage Spending Entries",
        actions: "Actions",
        edit: "Edit",
        delete: "Delete",
        editSpendingEntry: "Edit Spending Entry",
        setBudget: "Set Budget",
        manageCategories: "Manage Categories",
        budgetTitle: "Set Monthly Budget",
        budgetFor: "Budget for",
        noBudgetSet: "No budget set",
        budgetExceeded: "Budget exceeded for {category}: Spent {spent} of {budget}",
        recurrence: "Recurrence",
        none: "None",
        daily: "Daily",
        weekly: "Weekly",
        monthly: "Monthly",
        stopRecurrence: "Stop Recurrence",
        searchPlaceholder: "Search by category or type",
        filterByType: "Filter by Type",
        filterByCategory: "Filter by Category",
        dateRange: "Date Range",
        all: "All",
        startDate: "Start Date",
        endDate: "End Date",
        categoryWiseExpenses: "Category-wise Expenses",
        monthlyTrends: "Monthly Trends (Last 6 Months)",
        currency: "Currency",
        language: "Language",
        english: "English",
        nepali: "Nepali",
        addCategory: "Add Category",
        newCategory: "New Category",
        categoryName: "Category Name",
        deleteCategoryConfirm: "Are you sure you want to delete this category?",
        budgetOptional: "Budget setting is optional. Click 'Save' to set budgets, or 'Cancel' to skip.",
        addSpendingEntryHeader: "Add Spending Entry",
        addIncome: "Add Income",
        addExpense: "Add Expense",
        summaryReport: "Summary Report"
    },
    ne: {
        spendingTracker: "खर्च ट्र्याकर",
        addEntry: "प्रविष्टि थप्नुहोस्",
        viewSummary: "सारांश हेर्नुहोस्",
        manageEntries: "प्रविष्टिहरू व्यवस्थापन गर्नुहोस्",
        amount: "रकम",
        type: "प्रकार",
        category: "श्रेणी",
        date: "मिति",
        income: "आय",
        expense: "खर्च",
        food: "खाना",
        rent: "भाडा",
        salary: "तलब",
        utilities: "उपयोगिताहरू",
        entertainment: "मनोरञ्जन",
        other: "अन्य",
        cancel: "रद्द गर्नुहोस्",
        save: "सुरक्षित गर्नुहोस्",
        exportExcel: "एक्सेलमा निर्यात गर्नुहोस्",
        exportPDF: "PDF मा निर्यात गर्नुहोस्",
        close: "बन्द गर्नुहोस्",
        weeklySummary: "साप्ताहिक सारांश (हालको हप्ता, सोमबार देखि आइतबार)",
        day: "दिन",
        incomeLabel: "आय",
        expenses: "खर्च",
        balance: "सन्तुलन",
        monthlySummary: "मासिक सारांश",
        yearlySummary: "वार्षिक सारांश",
        totalIncome: "कुल आय",
        totalExpenses: "कुल खर्च",
        netBalance: "नेट सन्तुलन",
        manageEntriesTitle: "खर्च प्रविष्टिहरू व्यवस्थापन गर्नुहोस्",
        actions: "कार्यहरू",
        edit: "सम्पादन गर्नुहोस्",
        delete: "हटाउनुहोस्",
        editSpendingEntry: "खर्च प्रविष्टि सम्पादन गर्नुहोस्",
        setBudget: "बजेट सेट गर्नुहोस्",
        manageCategories: "श्रेणीहरू व्यवस्थापन गर्नुहोस्",
        budgetTitle: "मासिक बजेट सेट गर्नुहोस्",
        budgetFor: "को लागि बजेट",
        noBudgetSet: "कुनै बजेट सेट गरिएको छैन",
        budgetExceeded: "{category} को लागि बजेट नाघ्यो: {spent} खर्च गरियो, बजेट {budget}",
        recurrence: "पुनरावृत्ति",
        none: "कुनै पनि छैन",
        daily: "दैनिक",
        weekly: "साप्ताहिक",
        monthly: "मासिक",
        stopRecurrence: "पुनरावृत्ति रोक्नुहोस्",
        searchPlaceholder: "श्रेणी वा प्रकार द्वारा खोज्नुहोस्",
        filterByType: "प्रकार द्वारा फिल्टर गर्नुहोस्",
        filterByCategory: "श्रेणी द्वारा फिल्टर गर्नुहोस्",
        dateRange: "मिति दायरा",
        all: "सबै",
        startDate: "सुरु मिति",
        endDate: "अन्त्य मिति",
        categoryWiseExpenses: "श्रेणी अनुसार खर्च",
        monthlyTrends: "मासिक प्रवृत्तिहरू (पछिल्लो 6 महिना)",
        currency: "मुद्रा",
        language: "भाषा",
        english: "अंग्रेजी",
        nepali: "नेपाली",
        addCategory: "श्रेणी थप्नुहोस्",
        newCategory: "नयाँ श्रेणी",
        categoryName: "श्रेणीको नाम",
        deleteCategoryConfirm: "के तपाईं यो श्रेणी हटाउन निश्चित हुनुहुन्छ?",
        budgetOptional: "बजेट सेटिङ वैकल्पिक छ। बजेट सेट गर्न 'सुरक्षित गर्नुहोस्' क्लिक गर्नुहोस्, वा छोड्न 'रद्द गर्नुहोस्' क्लिक गर्नुहोस्।",
        addSpendingEntryHeader: "खर्च प्रविष्टि थप्नुहोस्",
        addIncome: "आय थप्नुहोस्",
        addExpense: "खर्च थप्नुहोस्",
        summaryReport: "सारांश प्रतिवेदन"
    }
};

function getTranslation(key) {
    const lang = localStorage.getItem('selectedLanguage') || 'en';
    return translations[lang][key] || key;
}

function applyTranslations() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        element.textContent = getTranslation(key);
    });
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        element.setAttribute('placeholder', getTranslation(key));
    });
}

// Currency conversion (hardcoded rates for simplicity)
const exchangeRates = {
    NRs: 1,          // Base currency (Nepali Rupees)
    USD: 0.0075,     // 1 USD = 133 NRs
    GBP: 0.0059      // 1 GBP = 170 NRs
};

function convertToDefaultCurrency(amount, fromCurrency) {
    const defaultCurrency = localStorage.getItem('defaultCurrency') || 'NRs';
    if (fromCurrency === defaultCurrency) return amount;
    const amountInNRs = amount / exchangeRates[fromCurrency]; // Convert to NRs
    return amountInNRs * exchangeRates[defaultCurrency]; // Convert to default currency
}
