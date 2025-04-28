function minifyJSON(data) {
    return JSON.stringify(data);
}

function parseMinifiedJSON(jsonString) {
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        console.error("Failed to parse JSON:", e);
        return [];
    }
}

function checkStorageCapacity() {
    const testKey = "__test__";
    let testString = "";
    try {
        for (let x = 0; x < 1000; x++) {
            testString += "a";
            localStorage.setItem(testKey, testString);
        }
    } catch (e) {
        console.warn("Storage capacity warning:", e);
        localStorage.removeItem(testKey);
        throw new Error("LocalStorage capacity exceeded.");
    }
    localStorage.removeItem(testKey);
}

function applyTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    const newTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
}
