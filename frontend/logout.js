// SV-36: Logout functionality
// Sprint 2 frontend prototype

document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.getElementById("logoutButton");

    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            window.location.href = "../frontend/login.html?logout=preview";
        });
    }
});