document.addEventListener("DOMContentLoaded", function () {
    const queryParameters = new URLSearchParams(
        window.location.search
    );

    const clipNumber = queryParameters.get("clip") || "1";

    const statusElement = document.querySelector("#clip-status");
    const messageElement = document.querySelector(
        "#action-message"
    );

    const approveButton = document.querySelector(
        "#approve-button"
    );

    const correctionButton = document.querySelector(
        "#correction-button"
    );

    const rejectButton = document.querySelector(
        "#reject-button"
    );

    const clipData = {
        1: {
            title: "Game Winning Shot",
            player: "Marcus Reed",
            team: "Eagles",
            type: "Game Winning Shot",
            description:
                "Possible game-winning shot near the end of the fourth quarter.",
            suggestedDescription:
                "Player makes a potential game-winning shot."
        },
        2: {
            title: "Defensive Highlight",
            player: "Jalen Price",
            team: "Falcons",
            type: "Defensive Highlight",
            description:
                "Possible defensive play requiring additional review.",
            suggestedDescription:
                "Player makes an important defensive play."
        },
        3: {
            title: "Winning Shot",
            player: "Marcus Reed",
            team: "Eagles",
            type: "Winning Shot",
            description:
                "Possible scoring play that needs corrected information.",
            suggestedDescription:
                "Player completes a possible winning shot."
        },
        4: {
            title: "Basketball Highlight",
            player: "Jordan Smith",
            team: "Cougars",
            type: "Basketball Highlight",
            description:
                "Clip metadata needs to be reviewed and corrected.",
            suggestedDescription:
                "Player creates an important basketball highlight."
        },
        5: {
            title: "Final Quarter Play",
            player: "Darius Brown",
            team: "Tigers",
            type: "Final Quarter Play",
            description:
                "Clip details require correction before approval.",
            suggestedDescription:
                "Player makes an important final quarter play."
        }
    };

    const selectedClip = clipData[clipNumber] || clipData[1];

    const correctionsKey =
        `clip-${clipNumber}-corrections`;

    const savedCorrections = localStorage.getItem(
        correctionsKey
    );

    let correctedInformation = {};

    if (savedCorrections) {
        correctedInformation = JSON.parse(savedCorrections);
    }

    const clip = {
        ...selectedClip,
        ...correctedInformation
    };

    document.querySelector("#clip-title").textContent =
        clip.title;

    document.querySelector("#clip-player").textContent =
        clip.player;

    document.querySelector("#clip-team").textContent =
        clip.team;

    document.querySelector("#clip-type").textContent =
        clip.type;

    document.querySelector("#information-player").textContent =
        clip.player;

    document.querySelector("#information-team").textContent =
        clip.team;

    document.querySelector("#information-type").textContent =
        clip.type;

    document.querySelector(
        "#information-description"
    ).textContent = clip.description;

    document.querySelector("#suggested-title").textContent =
        clip.title;

    document.querySelector(
        "#suggested-description"
    ).textContent = clip.suggestedDescription;

    const statusKey = `clip-${clipNumber}-status`;
    const savedStatus = localStorage.getItem(statusKey);

    if (savedStatus) {
        statusElement.textContent = savedStatus;
    }

    function updateStatus(newStatus, message) {
        const confirmed = window.confirm(
            `Are you sure you want to mark this clip as ${newStatus}?`
        );

        if (!confirmed) {
            return false;
        }

        localStorage.setItem(statusKey, newStatus);

        if (newStatus === "Approved") {
            window.location.href =
                `approve-list.html?clip=${clipNumber}`;

            return true;
        }

        if (newStatus === "Rejected") {
            window.location.href =
                `reject-list.html?clip=${clipNumber}`;

            return true;
        }

        statusElement.textContent = newStatus;
        messageElement.textContent = message;

        return true;
    }

    approveButton.addEventListener("click", function () {
        updateStatus(
            "Approved",
            "The clip was approved successfully."
        );
    });

    correctionButton.addEventListener("click", function () {
        const updated = updateStatus(
            "Needs Correction",
            "The clip was marked as needing correction."
        );

        if (updated) {
            window.location.href =
                `correction-list.html?clip=${clipNumber}`;
        }
    });

    rejectButton.addEventListener("click", function () {
        updateStatus(
            "Rejected",
            "The clip was rejected successfully."
        );
    });
});