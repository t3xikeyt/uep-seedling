// js/db.js - Database Setup (Tables: user_account, staff, requester, batch)

function initDatabase() {
    // 1. User Accounts Table (Admin, Staff, Requester)
    if (!localStorage.getItem("uep_users")) {
        const defaultUsers = [
            { id: 1, username: "admin", password: "123", role: "Admin", name: "Clonal Manager" },
            { id: 2, username: "staff", password: "123", role: "Staff", name: "Patrick Seguros" },
            { id: 3, username: "student", password: "123", role: "Requester", name: "Trixie Agonias" }
        ];
        localStorage.setItem("uep_users", JSON.stringify(defaultUsers));
    }

    // 2. Seedling Batch / Profiling Table
    if (!localStorage.getItem("uep_batches")) {
        const defaultBatches = [
            { batch_id: "001", species_name: "Narra", category: "Hardwood", origin: "UEP Clonal Core", initial_stock: 500, current_stock: 400, date_logged: "2026-09-01" },
            { batch_id: "002", species_name: "Mahogany", category: "Hardwood", origin: "UEP Clonal Core", initial_stock: 500, current_stock: 300, date_logged: "2026-09-05" },
            { batch_id: "003", species_name: "Mangga", category: "Fruit-bearing", origin: "UEP Clonal Core", initial_stock: 100, current_stock: 80, date_logged: "2026-09-10" }
        ];
        localStorage.setItem("uep_batches", JSON.stringify(defaultBatches));
    }
}

// Database helper functions
const DB = {
    getUsers: () => JSON.parse(localStorage.getItem("uep_users")) || [],
    getBatches: () => JSON.parse(localStorage.getItem("uep_batches")) || [],
    saveBatches: (data) => localStorage.setItem("uep_batches", JSON.stringify(data))
};

initDatabase();