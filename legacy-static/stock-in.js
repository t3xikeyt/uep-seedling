// js/stock-in.js - Handles Profiling and Stock Recording

// 1. Verify User Access
checkAccess();

// Set default today's date in form
document.getElementById("date_logged").valueAsDate = new Date();

// 2. Render Existing Batches in Table
function displayBatches() {
    const batches = DB.getBatches();
    const tbody = document.getElementById("batchTableBody");
    tbody.innerHTML = "";

    batches.forEach(b => {
        tbody.innerHTML += `
            <tr>
                <td><strong>#${b.batch_id}</strong></td>
                <td>${b.species_name}</td>
                <td>${b.category}</td>
                <td>${b.origin}</td>
                <td>${b.current_stock}</td>
                <td>${b.date_logged}</td>
            </tr>
        `;
    });
}

// 3. Handle Form Submission (Profiling & Stock-In)
document.getElementById("stockInForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const species = document.getElementById("species_name").value.trim();
    const category = document.getElementById("category").value;
    const origin = document.getElementById("origin").value.trim();
    const qty = parseInt(document.getElementById("quantity").value, 10);
    const dateLogged = document.getElementById("date_logged").value;

    let batches = DB.getBatches();

    // Check if the species already exists in this origin to add delta, or create new batch
    let existingBatch = batches.find(b => b.species_name.toLowerCase() === species.toLowerCase() && b.origin.toLowerCase() === origin.toLowerCase());

    if (existingBatch) {
        // Delta Computation (+ addition)
        existingBatch.current_stock += qty;
        existingBatch.initial_stock += qty;
        alert(`Stock updated! Added +${qty} to existing batch #${existingBatch.batch_id}.`);
    } else {
        // Create new Batch profiling record
        const nextId = String(batches.length + 1).padStart(3, '0');
        const newBatch = {
            batch_id: nextId,
            species_name: species,
            category: category,
            origin: origin,
            initial_stock: qty,
            current_stock: qty,
            date_logged: dateLogged
        };
        batches.push(newBatch);
        alert(`New Batch #${nextId} (${species}) profiled and added to storage!`);
    }

    // Save and re-render
    DB.saveBatches(batches);
    displayBatches();
    document.getElementById("stockInForm").reset();
    document.getElementById("date_logged").valueAsDate = new Date();
});

function logout() {
    sessionStorage.clear();
    window.location.href = "index.html";
}

displayBatches();