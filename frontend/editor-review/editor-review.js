document.addEventListener("DOMContentLoaded", function () {
    const reviewQueueButton = document.querySelector(
        "#reviewQueueButton"
    );

    const pendingSection = document.querySelector(
        ".pending_section"
    );

    const pendingList = document.querySelector(
        ".clip_list"
    );

    const allowedPendingStatuses = [
        "Pending",
        "Awaiting Re-review"
    ];

    const clipNumbers = [1, 2, 3, 4, 5];

    const counts = {
        pending: 0,
        approved: 0,
        correction: 0,
        rejected: 0
    };

    clipNumbers.forEach(function (clipNumber) {
        const statusKey = `clip-${clipNumber}-status`;
        const correctionsKey =
            `clip-${clipNumber}-corrections`;

        const savedStatus =
            localStorage.getItem(statusKey) || "Pending";

        const savedCorrections = localStorage.getItem(
            correctionsKey
        );

        if (
            savedStatus === "Pending" ||
            savedStatus === "Awaiting Re-review"
        ) {
            counts.pending++;
        } else if (
            savedStatus === "Approved" ||
            savedStatus === "Published"
        ) {
            counts.approved++;
        } else if (savedStatus === "Needs Correction") {
            counts.correction++;
        } else if (savedStatus === "Rejected") {
            counts.rejected++;
        }

        const row = document.querySelector(
            `.clip_row[data-clip="${clipNumber}"]`
        );

        if (!row) {
            return;
        }

        if (!allowedPendingStatuses.includes(savedStatus)) {
            row.remove();
            return;
        }

        const rowFields = row.querySelectorAll(
            ":scope > span"
        );

        const titleElement = rowFields[0];
        const teamElement = rowFields[1];
        const statusElement = row.querySelector(
            ".clip-status"
        );

        if (savedCorrections) {
            const correctedInformation =
                JSON.parse(savedCorrections);

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

    if (reviewQueueButton) {
        reviewQueueButton.addEventListener(
            "click",
            function () {
                window.location.href =
                    "pending-review.html";
            }
        );
    }

    document
        .querySelectorAll(".card_action")
        .forEach(function (card) {
            const label = card
                .querySelector("span")
                .textContent
                .trim();

            const countElement = card.querySelector(
                ".count"
            );

            if (label === "Pending") {
                countElement.textContent =
                    counts.pending;
            } else if (label === "Approve") {
                countElement.textContent =
                    counts.approved;
            } else if (
                label === "Needs Correction"
            ) {
                countElement.textContent =
                    counts.correction;
            } else if (label === "Reject") {
                countElement.textContent =
                    counts.rejected;
            }
        });

    if (
        pendingList &&
        pendingList.children.length === 0
    ) {
        pendingList.innerHTML = `
            <p class="no-pending-message">
                There are currently no clips waiting
                for review.
            </p>
        `;
    }
});