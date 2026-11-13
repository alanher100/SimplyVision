
 // SimplyVision - Login Authentication
 // Sprint 3: Backend Integration (SV-203)

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("errorMessage");

// Handle login form submission
loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Clear previous messages
    errorMessage.textContent = "";
    errorMessage.className = "";

    if (email === "") {
        errorMessage.textContent = "Please enter your email address.";
        errorMessage.className = "error";
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        errorMessage.textContent = "Please enter a valid email address.";
        errorMessage.className = "error";
        return;
    }

    if (password === "") {
        errorMessage.textContent = "Please enter your password.";
        errorMessage.className = "error";
        return;
    }

    // Authenticate with Express and MySQL
    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin",
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (!response.ok) {
            errorMessage.textContent =
                result.message || "Login failed.";
            errorMessage.className = "error";
            return;
        }

        errorMessage.textContent = "Login successful!";
        errorMessage.className = "success";

        // Redirect to dashboard after successful login
        window.location.href = "/dashboard/index.html";

    } catch (error) {
        console.error("Login request failed:", error);

        errorMessage.textContent =
            "Unable to connect to the server.";
        errorMessage.className = "error";
    }
});

// Sprint 2 - Show/Hide Password
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", function () {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.textContent = "Hide";
        togglePassword.setAttribute("aria-label", "Hide password");
        togglePassword.setAttribute("aria-pressed", "true");
    } else {
        passwordInput.type = "password";
        togglePassword.textContent = "Show";
        togglePassword.setAttribute("aria-label", "Show password");
        togglePassword.setAttribute("aria-pressed", "false");
    }
});
