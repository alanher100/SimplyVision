
/* SimplyVision reusable sidebar component */

async function loadSidebar() {
    const container = document.getElementById("sidebar-container");

    if (!container) {
        console.warn("Sidebar container not found.");
        return;
    }

    try {
        // Load the shared sidebar HTML.
        const response = await fetch("/frontend/components/sidebar.html");

        if (!response.ok) {
            throw new Error(`Failed to load sidebar: ${response.status}`);
        }

        container.innerHTML = await response.text();

        // Highlight the active page.
        const currentPath = window.location.pathname;

        const links = container.querySelectorAll("nav a");

        links.forEach((link) => {
            const linkPath = new URL(link.href).pathname;

            if (
            linkPath === currentPath ||
            (link.dataset.page === "candidate-clips" &&
            currentPath === "/frontend/candidate-clips/all-clips.html")
        ) {
                link.classList.add("active");
                link.setAttribute("aria-current", "page");
            }
        });

        // Connect logout after the sidebar has loaded.
        const logoutButton = container.querySelector("#logoutButton");

        if (logoutButton) {
            logoutButton.addEventListener("click", async function (event) {
                event.preventDefault();
                logoutButton.disabled = true;

                try {
                    const response = await fetch("/api/logout", {
                        method: "POST",
                        credentials: "same-origin"
                    });

                    if (!response.ok) {
                        throw new Error("Logout failed");
                    }

                    window.location.href = "/frontend/login.html";
                } catch (error) {
                    console.error("Logout error:", error);
                    alert("Unable to sign out. Please try again.");
                    logoutButton.disabled = false;
                }
            });
        }

        // Let other scripts know the sidebar is ready.
        document.dispatchEvent(new CustomEvent("sidebar:loaded"));

    } catch (error) {
        console.error("Sidebar loading error:", error);
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadSidebar);
} else {
    loadSidebar();
}
