
 // SV-36 and SV-203: Logout functionality
// Sprint 3: Express session integration

document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.getElementById("logoutButton");

    if (logoutButton) {
        logoutButton.addEventListener("click", async function (event) {
            event.preventDefault();

            // Prevent repeated logout requests
            logoutButton.disabled = true;

            try {
                const response = await fetch("/api/logout", {
                    method: "POST",
                    credentials: "same-origin"
                });

                if (!response.ok) {
                    throw new Error("Logout failed");
                }

                // Redirect only after session is destroyed
                window.location.href = "/frontend/login.html";

            } catch (error) {
                console.error("Logout error:", error);
                alert("Unable to sign out. Please try again.");
                logoutButton.disabled = false;
            }
        });
    }
});
