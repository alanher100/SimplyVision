document.addEventListener("DOMContentLoaded", function () {
    const correctionList = document.querySelector(
        "#correction-list"
    );

    const clips = [
        {
            number: 1,
            title: "Game Winning Shot",
            team: "Eagles",
            player: "Marcus Reed",
            playerNumber: "#11",
            description:
                "Possible game-winning shot near the end of the fourth quarter."
        },
        {
            number: 2,
            title: "Defensive Highlight",
            team: "Falcons",
            player: "Jalen Price",
            playerNumber: "#23",
            description:
                "Possible defensive play requiring additional review."
        },
        {
            number: 3,
            title: "Winning Shot",
            team: "Eagles",
            player: "Marcus Reed",
            playerNumber: "#11",
            description:
                "Possible scoring play that needs corrected information."
        },
        {
            number: 4,
            title: "Basketball Highlight",
            team: "Cougars",
            player: "Jordan Smith",
            playerNumber: "#10",
            description:
                "Clip metadata needs to be reviewed and corrected."
        },
        {
            number: 5,
            title: "Final Quarter Play",
            team: "Tigers",
            player: "Darius Brown",
            playerNumber: "#7",
            description:
                "Clip details require correction before approval."
        }
    ];

    const correctionClips = clips.filter(function (clip) {
        const status = localStorage.getItem(
            `clip-${clip.number}-status`
        );

        return status === "Needs Correction";
    });

    if (correctionClips.length === 0) {
        correctionList.innerHTML = `
            <p class="no-corrections-message">
                There are currently no clips requiring correction.
            </p>
        `;

        return;
    }

    correctionClips.forEach(function (clip) {
        const savedCorrections = localStorage.getItem(
            `clip-${clip.number}-corrections`
        );

        let clipInformation = clip;

        if (savedCorrections) {
            clipInformation = {
                ...clip,
                ...JSON.parse(savedCorrections)
            };
        }

        const card = document.createElement("article");

        card.className = "correction-card";
        card.dataset.clip = clip.number;

        card.innerHTML = `
            <img
                class="correction-thumbnail"
                src="../assets/basketball-banner.jpg"
                alt="Basketball correction clip"
            >

            <div class="correction-details">
                <h3>${clipInformation.title}</h3>

                <p>
                    <strong>Team:</strong>
                    ${clipInformation.team}
                </p>

                <p>
                    <strong>Player:</strong>
                    ${clipInformation.player}
                </p>

                <p>
                    <strong>Player Number:</strong>
                    ${clipInformation.playerNumber}
                </p>

                <p>
                    <strong>Description:</strong>
                    ${clipInformation.description}
                </p>

                <p>
                    <strong>Status:</strong>
                    <span class="correction-status">
                        Needs Correction
                    </span>
                </p>
            </div>

            <div class="correction-actions">
                <a
                    class="review-correction-button"
                    href="correction-form.html?clip=${clip.number}"
                >
                    Review Correction
                </a>
            </div>
        `;

        correctionList.appendChild(card);
    });
});