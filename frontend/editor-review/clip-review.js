document.addEventListener("DOMContentLoaded", function () {
    const queryParameters = new URLSearchParams(
        window.location.search
    );

    const clipNumber = queryParameters.get("clip") || "1";

    const statusElement = document.querySelector("#clip-status");
    const messageElement = document.querySelector("#action-message");

    const approveButton = document.querySelector("#approve-button");
    const correctionButton = document.querySelector(
        "#correction-button"
    );
    const rejectButton = document.querySelector("#reject-button");

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

        localStorage.setItem(storageKey, newStatus);

        if (newStatus === "Approved") {
            window.location.href =
                `approve-list.html?clip=${clipNumber}`;
            return;
        }

        if (newStatus === "Rejected") {
        window.location.href =
            `reject-list.html?clip=${clipNumber}`;
        return;
        }

        statusElement.textContent = newStatus;
        messageElement.textContent = message;
    }

    approveButton.addEventListener("click", function () {
        updateStatus(
            "Approved",
            "The clip was approved successfully."
        );
    });

    correctionButton.addEventListener("click", function () {
        updateStatus(
            "Needs Correction",
            "The clip was marked as needing correction."
        );
    });

    rejectButton.addEventListener("click", function () {
        updateStatus(
            "Rejected",
            "The clip was rejected successfully."
        );
    });
});