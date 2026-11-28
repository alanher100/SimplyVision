document.addEventListener("DOMContentLoaded", function () {
    const pendingList = document.querySelector(
        ".pending-clip-list"
    );

    const allowedStatuses = [
        "Pending",
        "Awaiting Re-review"
    ];

    const cards = document.querySelectorAll(
        ".pending-clip-card"
    );

    cards.forEach(function (card) {
        const clipNumber = card.dataset.clip;

        const titleElement = card.querySelector(
            ".pending-title"
        );

        const teamElement = card.querySelector(
            ".pending-team"
        );

        const playerElement = card.querySelector(
            ".pending-player"
        );

        const statusElement = card.querySelector(
            ".pending-status"
        );

        const statusKey = `clip-${clipNumber}-status`;
        const correctionsKey =
            `clip-${clipNumber}-corrections`;

        const savedStatus =
            localStorage.getItem(statusKey) || "Pending";

        const savedCorrections = localStorage.getItem(
            correctionsKey
        );

        if (!allowedStatuses.includes(savedStatus)) {
            card.remove();
            return;
        }

        if (savedCorrections) {
            const correctedInformation = JSON.parse(
                savedCorrections
            );

            if (
                correctedInformation.title &&
                titleElement
            ) {
                titleElement.textContent =
                    correctedInformation.title;
            }

            if (
                correctedInformation.team &&
                teamElement
            ) {
                teamElement.textContent =
                    correctedInformation.team;
            }

            if (
                correctedInformation.player &&
                playerElement
            ) {
                playerElement.textContent =
                    correctedInformation.player;
            }
        }

        if (statusElement) {
            statusElement.textContent = savedStatus;

            statusElement.classList.remove(
                "status-pending"
            );

            statusElement.classList.add(
                "status-updated"
            );
        }
    });

    if (pendingList.children.length === 0) {
        pendingList.innerHTML = `
            <p class="no-pending-message">
                There are currently no clips waiting for review.
            </p>
        `;
    }
});