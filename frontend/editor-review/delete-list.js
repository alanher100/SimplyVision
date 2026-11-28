document.addEventListener("DOMContentLoaded", function () {
    const queryParameters = new URLSearchParams(
        window.location.search
    );

    const clipNumber = queryParameters.get("clip") || "1";
    const storageKey = `clip-${clipNumber}-status`;

    const clipCard = document.querySelector(
        ".rejected-clip-card"
    );

    const rejectedList = document.querySelector(
        ".rejected-list"
    );

    const confirmDeleteButton = document.querySelector(
        "#confirm-delete-button"
    );

    const keepClipButton = document.querySelector(
        "#keep-clip-button"
    );

    const keepOptions = document.querySelector(
        "#keep-options"
    );

    const savedStatus = localStorage.getItem(storageKey);

    if (
        !clipCard ||
        !rejectedList ||
        !confirmDeleteButton ||
        !keepClipButton ||
        !keepOptions
    ) {
        return;
    }

    if (savedStatus !== "Pending Deletion") {
        clipCard.remove();

        rejectedList.innerHTML = `
            <p class="removed-message">
                This clip is no longer pending deletion.
            </p>
        `;

        return;
    }

    confirmDeleteButton.addEventListener(
        "click",
        function () {
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
        }
    );

    keepClipButton.addEventListener(
        "click",
        function () {
            keepOptions.hidden = false;
        }
    );

    const approveClipButton = document.querySelector(
        "#approve-clip-button"
    );

    if (approveClipButton) {
        approveClipButton.addEventListener(
            "click",
            function () {
                localStorage.setItem(
                    storageKey,
                    "Approved"
                );

                window.location.href =
                    `approve-list.html?clip=${clipNumber}`;
            }
        );
    }

    const correctionClipButton = document.querySelector(
        "#correction-clip-button"
    );

    if (correctionClipButton) {
        correctionClipButton.addEventListener(
            "click",
            function () {
                localStorage.setItem(
                    storageKey,
                    "Needs Correction"
                );

                window.location.href =
                    `correction-list.html?clip=${clipNumber}`;
            }
        );
    }

    const rejectClipButton = document.querySelector(
        "#reject-clip-button"
    );

    if (rejectClipButton) {
        rejectClipButton.addEventListener(
            "click",
            function () {
                localStorage.setItem(
                    storageKey,
                    "Rejected"
                );

                window.location.href =
                    `reject-list.html?clip=${clipNumber}`;
            }
        );
    }
});