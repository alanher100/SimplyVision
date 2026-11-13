// SimplyVision - Login Form Validation
// Sprint 2: Frontend JavaScript (SV-6)

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("errorMessage");

// Listen for login form submission
loginForm.addEventListener("submit", function (event) {

    // Prevent page from refreshing
    event.preventDefault();

    // Get user input
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Clear previous errors
    errorMessage.textContent = "";
    errorMessage.className = "";

    // Check if email is empty
    if (email === "") {
        errorMessage.textContent = "Please enter your email address.";
        errorMessage.className = "error";
        return;
    }

    // Check email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        errorMessage.textContent = "Please enter a valid email address.";
        errorMessage.className = "error";
        return;
    }

    // Check if password is empty
    if (password === "") {
        errorMessage.textContent = "Please enter your password.";
        errorMessage.className = "error";
        return;
    }

    // Frontend validation successful
    errorMessage.textContent =
        "Form validated! Authentication is not connected yet.";

    errorMessage.className = "success";

    console.log("Login form validation successful.");
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