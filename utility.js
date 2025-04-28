function parseMinifiedJSON(json) {
    try {
        return JSON.parse(json);
    } catch (e) {
        handleError("Failed to parse JSON: " + e, "Invalid data format.");
        return [];
    }
}

function minifyJSON(data) {
    try {
        return JSON.stringify(data);
    } catch (e) {
        handleError("Failed to minify JSON: " + e, "Error processing data.");
        return "";
    }
}

function sanitizeInput(input) {
    if (window.DOMPurify && typeof window.DOMPurify.sanitize === "function") {
        return DOMPurify.sanitize(input);
    }
    handleError("DOMPurify not available.", "Input processing failed.");
    return "";
}

function checkStorageCapacity() {
    const total = Object.keys(localStorage).reduce((sum, key) => {
        return sum + ((localStorage[key].length + key.length) * 2);
    }, 0);
    const maxBytes = 5 * 1024 * 1024; // 5MB
    if (total > 0.9 * maxBytes) {
        handleError("Storage nearing capacity: " + (total / maxBytes * 100) + "%", "Storage almost full.");
        return false;
    }
    return true;
}

function handleError(message, userMessage) {
    console.error(message);
    const toast = document.createElement("div");
    toast.className = "toast align-items-center text-white bg-danger border-0";
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
    toast.setAttribute("aria-atomic", "true");
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${userMessage}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    document.querySelector(".toast-container").appendChild(toast);
    new bootstrap.Toast(toast).show();
}

function applyTheme() {
    document.documentElement.setAttribute("data-theme", "light");
}

function exportToCSV(data, filename) {
    const csv = data.map(row => Object.values(row).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function exportToPDF(data, title, filename) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(title, 10, 10);
    let y = 20;
    data.forEach(row => {
        doc.text(Object.values(row).join(" | "), 10, y);
        y += 10;
    });
    doc.save(filename);
}