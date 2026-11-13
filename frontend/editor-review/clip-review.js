const queryParameters = new URLSearchParams(window.location.search);
const clipNumber = queryParameters.get("clip") || "1";

const statusElement = document.querySelector("#clip-status");
const messageElement = document.querySelector("#action-message");

const storageKey = `clip-${clipNumber}-status`;
const savedStatus = localStorage.getItem(storageKey);

if (savedStatus) {
    statusElement.textContent = savedStatus;
}

function updateStatus(newStatus, message) {
    const confirmed = window.confirm(
        `Are you sure you want to mark this clip as ${newStatus}?`
    );

    if (!confirmed) {
        return;
    }

    statusElement.textContent = newStatus;
    localStorage.setItem(storageKey, newStatus);

    messageElement.textContent = message;
}

document
    .querySelector("#approve-button")
    .addEventListener("click", function () {
        updateStatus(
            "Approved",
            "The clip was approved successfully."
        );
    });

document
    .querySelector("#correction-button")
    .addEventListener("click", function () {
        updateStatus(
            "Needs Correction",
            "The clip was marked as needing correction."
        );
    });

document
    .querySelector("#reject-button")
    .addEventListener("click", function () {
        updateStatus(
            "Rejected",
            "The clip was rejected successfully."
        );
    });