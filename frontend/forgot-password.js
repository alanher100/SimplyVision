// SimplyVision - Forgot Password
// Sprint 2: Frontend JavaScript (SV-6)

const forgotPasswordForm = document.getElementById("forgotPasswordForm");
const emailInput = document.getElementById("email");
const errorMessage = document.getElementById("errorMessage");

// Listen for password reset form submission
forgotPasswordForm.addEventListener("submit", function (event) {

    // Prevent page from refreshing
    event.preventDefault();

    // Get user input
    const email = emailInput.value.trim();

    // Clear previous messages
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

    // Frontend validation successful
    errorMessage.textContent =
        "Email validated! Password reset emails are not enabled yet.";

    errorMessage.className = "success";

    console.log("Forgot password form validation successful.");
});