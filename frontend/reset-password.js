// SimplyVision - Reset Password
// Sprint 2: Frontend JavaScript Prototype

const resetForm = document.getElementById("resetPasswordForm");

const newPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");

const resetMessage = document.getElementById("resetMessage");

const strengthLabel = document.getElementById("strengthLabel");
const strengthBars = document.querySelectorAll(".strength-bars span");

const lengthRequirement = document.getElementById("lengthRequirement");
const numberRequirement = document.getElementById("numberRequirement");
const letterRequirement = document.getElementById("letterRequirement");

// Password requirements
function checkPasswordRequirements(password) {
    return {
        length: password.length >= 8,
        number: /\d/.test(password),
        letter: /[a-zA-Z]/.test(password)
    };
}

// Update password strength and requirements
function updatePasswordStrength() {
    const password = newPassword.value;
    const requirements = checkPasswordRequirements(password);

    // Update requirement indicators
    lengthRequirement.textContent =
        `${requirements.length ? "✓" : "○"} At least 8 characters`;

    numberRequirement.textContent =
        `${requirements.number ? "✓" : "○"} Includes a number`;

    letterRequirement.textContent =
        `${requirements.letter ? "✓" : "○"} Includes a letter`;

    lengthRequirement.className =
        requirements.length ? "met" : "unmet";

    numberRequirement.className =
        requirements.number ? "met" : "unmet";

    letterRequirement.className =
        requirements.letter ? "met" : "unmet";

    // Calculate basic strength score
    let score = 0;

    if (requirements.length) score++;
    if (requirements.number) score++;
    if (requirements.letter) score++;
    if (password.length >= 12 && /[^a-zA-Z0-9]/.test(password)) score++;

    // Reset strength bars
    strengthBars.forEach(bar => {
        bar.style.backgroundColor = "#ddd";
    });

    if (password === "") {
        strengthLabel.textContent = "Not entered";
        strengthLabel.style.color = "#777";
        return;
    }

    const labels = ["Poor", "Poor", "Fair", "Good", "Excellent"];
    const colors = ["#d32f2f", "#d32f2f", "#f59e0b", "#3b82f6", "#40cc91"];

    strengthLabel.textContent = labels[score];
    strengthLabel.style.color = colors[score];

    strengthBars.forEach((bar, index) => {
        if (index < Math.max(1, score)) {
            bar.style.backgroundColor = colors[score];
        }
    });
}

// Show/Hide Password functionality
function setupPasswordToggle(buttonId, input) {
    const button = document.getElementById(buttonId);

    button.addEventListener("click", function () {
        const isHidden = input.type === "password";

        input.type = isHidden ? "text" : "password";
        button.textContent = isHidden ? "Hide" : "Show";

        button.setAttribute(
            "aria-label",
            isHidden ? "Hide password" : "Show password"
        );

        button.setAttribute(
            "aria-pressed",
            String(isHidden)
        );
    });
}

// Initialize password toggles
setupPasswordToggle("toggleNewPassword", newPassword);
setupPasswordToggle("toggleConfirmPassword", confirmPassword);

// Update strength as user types
newPassword.addEventListener("input", updatePasswordStrength);

// Handle password reset form submission
resetForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const password = newPassword.value;
    const confirmation = confirmPassword.value;

    const requirements = checkPasswordRequirements(password);

    resetMessage.textContent = "";
    resetMessage.className = "";

    // Check empty password
    if (password === "") {
        resetMessage.textContent = "Please enter a new password.";
        resetMessage.className = "error";
        return;
    }

    // Check requirements
    if (!requirements.length ||
        !requirements.number ||
        !requirements.letter) {

        resetMessage.textContent =
            "Please meet all password requirements.";

        resetMessage.className = "error";
        return;
    }

    // Check confirmation
    if (confirmation === "") {
        resetMessage.textContent =
            "Please confirm your new password.";

        resetMessage.className = "error";
        return;
    }

    // Check matching passwords
    if (password !== confirmation) {
        resetMessage.textContent =
            "Passwords do not match.";

        resetMessage.className = "error";
        return;
    }

    // Frontend validation successful
    resetMessage.textContent =
        "Password validated! No password has been changed.";

    resetMessage.className = "success";

    console.log("Reset password frontend validation successful.");
});