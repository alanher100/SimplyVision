document.addEventListener("DOMContentLoaded", function () {
    const queryParameters = new URLSearchParams(
        window.location.search
    );

    const clipNumber = queryParameters.get("clip") || "1";

    const form = document.querySelector("#correction-form");
    const titleInput = document.querySelector("#clip-title");
    const playerInput = document.querySelector("#player");
    const playerNumberInput = document.querySelector(
        "#player-number"
    );
    const teamInput = document.querySelector("#team");
    const descriptionInput = document.querySelector(
        "#clip-description"
    );
    const statisticsInput = document.querySelector(
        "#suggested-statistics"
    );
    const labelsInput = document.querySelector("#event-labels");

    const messageElement = document.querySelector("#form-message");
    const cancelButton = document.querySelector("#cancel-button");
    const resubmitButton = document.querySelector(
        "#resubmit-button"
    );

    const statusKey = `clip-${clipNumber}-status`;
    const correctionsKey =
        `clip-${clipNumber}-corrections`;

    const clipInformation = {
        1: {
            title: "Game Winning Shot",
            player: "Marcus Reed",
            playerNumber: "#11",
            team: "Eagles",
            description:
                "Possible game-winning shot near the end of the fourth quarter.",
            suggestedStatistics: "Demo statistics",
            eventLabels: "Shot, Fourth Quarter"
        },
        2: {
            title: "Defensive Highlight",
            player: "Jalen Price",
            playerNumber: "#23",
            team: "Falcons",
            description:
                "Possible defensive play requiring additional review.",
            suggestedStatistics: "Defensive play",
            eventLabels: "Defense, Steal"
        },
        3: {
            title: "Winning Shot",
            player: "Marcus Reed",
            playerNumber: "#11",
            team: "Eagles",
            description:
                "Possible scoring play that needs corrected information.",
            suggestedStatistics: "Possible points scored",
            eventLabels: "Shot, Fourth Quarter"
        },
        4: {
            title: "Basketball Highlight",
            player: "Jordan Smith",
            playerNumber: "#10",
            team: "Cougars",
            description:
                "Clip metadata needs to be reviewed and corrected.",
            suggestedStatistics: "Demo statistics",
            eventLabels: "Highlight, Basketball"
        },
        5: {
            title: "Final Quarter Play",
            player: "Darius Brown",
            playerNumber: "#7",
            team: "Tigers",
            description:
                "Clip details require correction before approval.",
            suggestedStatistics:
                "Final quarter statistics",
            eventLabels: "Fourth Quarter, Play"
        }
    };

    const savedCorrections = localStorage.getItem(
        correctionsKey
    );

    const savedInformation = savedCorrections
        ? JSON.parse(savedCorrections)
        : {};

    const currentInformation = {
        ...clipInformation[clipNumber],
        ...savedInformation
    };

    titleInput.value = currentInformation.title;
    playerInput.value = currentInformation.player;
    playerNumberInput.value =
        currentInformation.playerNumber;
    teamInput.value = currentInformation.team;
    descriptionInput.value =
        currentInformation.description;
    statisticsInput.value =
        currentInformation.suggestedStatistics;
    labelsInput.value =
        currentInformation.eventLabels;

    function getFormInformation() {
        return {
            title: titleInput.value.trim(),
            player: playerInput.value.trim(),
            playerNumber: playerNumberInput.value.trim(),
            team: teamInput.value.trim(),
            description: descriptionInput.value.trim(),
            suggestedStatistics:
                statisticsInput.value.trim(),
            eventLabels: labelsInput.value.trim()
        };
    }

    function showMessage(message, messageType) {
        messageElement.textContent = message;
        messageElement.className =
            `form-message ${messageType}`;
    }

    function saveCorrections() {
        const updatedInformation = getFormInformation();

        localStorage.setItem(
            correctionsKey,
            JSON.stringify(updatedInformation)
        );

        localStorage.setItem(
            statusKey,
            "Needs Correction"
        );

        showMessage(
            "Corrections saved successfully.",
            "success"
        );
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!form.checkValidity()) {
            showMessage(
                "Please complete all required fields.",
                "error"
            );

            form.reportValidity();
            return;
        }

        saveCorrections();
    });

    cancelButton.addEventListener("click", function () {
        window.location.href = "correction-list.html";
    });

    resubmitButton.addEventListener("click", function () {
        if (!form.checkValidity()) {
            showMessage(
                "Please complete all required fields before resubmitting.",
                "error"
            );

            form.reportValidity();
            return;
        }

        const confirmed = window.confirm(
            "Send this corrected clip for re-review?"
        );

        if (!confirmed) {
            return;
        }

        const updatedInformation = getFormInformation();

        localStorage.setItem(
            correctionsKey,
            JSON.stringify(updatedInformation)
        );

        localStorage.setItem(
            statusKey,
            "Awaiting Re-review"
        );

        showMessage(
            "The corrected clip was sent for re-review.",
            "success"
        );

        setTimeout(function () {
            window.location.href =
                "pending-review.html";
        }, 1000);
    });
});