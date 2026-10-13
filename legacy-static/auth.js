// js/auth.js - Handles Authentication & Role Checking

document.getElementById("loginForm")?.addEventListener("submit", function(e) {
    e.preventDefault();
    
    const userIn = document.getElementById("username").value.trim();
    const passIn = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("error-msg");

    const users = DB.getUsers();
    const matchedUser = users.find(u => u.username === userIn && u.password === passIn);

    if (matchedUser) {
        // Save current session
        sessionStorage.setItem("loggedUser", JSON.stringify(matchedUser));
        
        // Redirect according to Gantt Chart scope:
        if (matchedUser.role === "Admin" || matchedUser.role === "Staff") {
            window.location.href = "stock-in.html"; // Open Stock-In module
        } else {
            alert("Requester portal is scheduled for October. Logged in as: " + matchedUser.name);
        }
    } else {
        errorMsg.textContent = "Invalid username or password!";
    }
});

// Guard function to ensure only logged-in Admin or Staff can access internal pages
function checkAccess() {
    const session = JSON.parse(sessionStorage.getItem("loggedUser"));
    if (!session || (session.role !== "Admin" && session.role !== "Staff")) {
        alert("Access Denied: Only Admin and Staff are authorized.");
        window.location.href = "index.html";
    }
    return session;
}