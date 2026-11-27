document.addEventListener("DOMContentLoaded", function () {
    const queryParameters = new URLSearchParams(
        window.location.search
    );

    const clipNumber = queryParameters.get("clip") || "1";
    const storageKey = `clip-${clipNumber}-status`;

    const clipCard = document.querySelector(
        ".rejected-clip-card"
    );

    const rejectedList = document.querySelector(".rejected-list");
    const confirmDeleteButton = document.querySelector(
        "#confirm-delete-button"
    );
    const keepClipButton = document.querySelector(
        "#keep-clip-button"
    );
    const keepOptions = document.querySelector("#keep-options");

    confirmDeleteButton.addEventListener("click", function () {
        const confirmed = window.confirm(
            "This will permanently delete the clip. Continue?"
        );

        if (!confirmed) {
            return;
        }

        localStorage.setItem(storageKey, "Deleted");
        clipCard.remove();

        const message = document.createElement("p");
        message.textContent =
            "The clip was permanently deleted.";
        message.className = "delete-message";

        rejectedList.appendChild(message);
    });

    keepClipButton.addEventListener("click", function () {
        keepOptions.hidden = false;
    });

    document
        .querySelector("#approve-clip-button")
        .addEventListener("click", function () {
            localStorage.setItem(storageKey, "Approved");
            window.location.href =
                `approve-list.html?clip=${clipNumber}`;
        });

    document
        .querySelector("#correction-clip-button")
        .addEventListener("click", function () {
            localStorage.setItem(
                storageKey,
                "Needs Correction"
            );

            window.location.href =
                `clip-review.html?clip=${clipNumber}`;
        });

    document
        .querySelector("#reject-clip-button")
        .addEventListener("click", function () {
            localStorage.setItem(storageKey, "Rejected");
            window.location.href =
                `reject-list.html?clip=${clipNumber}`;
        });
});