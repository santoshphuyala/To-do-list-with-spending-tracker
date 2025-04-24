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
    // Notify child iframes of theme change
    const todoIframe = document.getElementById('todoIframe');
    const spendingIframe = document.getElementById('spendingIframe');
    if (todoIframe) {
        todoIframe.contentWindow.postMessage({ theme: newTheme }, '*');
    }
    if (spendingIframe) {
        spendingIframe.contentWindow.postMessage({ theme: newTheme }, '*');
    }
}

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