document.addEventListener("DOMContentLoaded", function () {
    const approvedList = document.querySelector("#approved-list");

    const clips = [
        {
            number: 1,
            title: "Game Winning Shot",
            team: "Eagles",
            player: "Marcus Reed",
            playerNumber: "#11"
        },
        {
            number: 2,
            title: "Winning Shot",
            team: "Falcons",
            player: "Jalen Price",
            playerNumber: "#3"
        },
        {
            number: 3,
            title: "Fast Break Highlight",
            team: "Eagles",
            player: "Marcus Reed",
            playerNumber: "#11"
        },
        {
            number: 4,
            title: "Three Point Shot",
            team: "Falcons",
            player: "Jalen Price",
            playerNumber: "#3"
        },
        {
            number: 5,
            title: "Defensive Highlight",
            team: "Eagles",
            player: "Marcus Reed",
            playerNumber: "#11"
        }
    ];

    const approvedClips = clips.filter(function (clip) {
        const status = localStorage.getItem(
            `clip-${clip.number}-status`
        );

        return status === "Approved" || status === "Published";
    });

    if (approvedClips.length === 0) {
        const message = document.createElement("p");

        message.textContent =
            "There are no approved clips to display.";

        message.className = "removed-message";

        approvedList.appendChild(message);

        return;
    }

    approvedClips.forEach(function (clip) {
        const storageKey = `clip-${clip.number}-status`;
        const currentStatus = localStorage.getItem(storageKey);

        const article = document.createElement("article");

        article.className = "approved-clip-card";

        article.innerHTML = `
            <img
                class="approved-thumbnail"
                src="../assets/basketball-banner.jpg"
                alt="Approved basketball clip"
            >

            <div class="approved-details">
                <h3>${clip.title}</h3>

                <p>
                    <strong>Team:</strong>
                    ${clip.team}
                </p>

                <p>
                    <strong>Player:</strong>
                    ${clip.player}
                </p>

                <p>
                    <strong>Player Number:</strong>
                    ${clip.playerNumber}
                </p>

                <p>
                    <strong>Game Statistics:</strong>
                    Demo statistics
                </p>

                <p>
                    <strong>Status:</strong>
                    <span class="approved-status">
                        ${currentStatus}
                    </span>
                </p>

                <p class="publish-message"></p>
            </div>

            <div class="approved-actions">
                <a
                    class="back-review-button"
                    href="clip-review.html?clip=${clip.number}"
                >
                    Back to Review
                </a>

                <button
                    class="publish-button"
                    type="button"
                >
                    Publish
                </button>
            </div>
        `;

        approvedList.appendChild(article);

        const publishButton = article.querySelector(
            ".publish-button"
        );

        const statusElement = article.querySelector(
            ".approved-status"
        );

        const publishMessage = article.querySelector(
            ".publish-message"
        );

        publishButton.addEventListener("click", function () {
            const confirmed = window.confirm(
                "Are you sure you want to publish this clip?"
            );

            if (!confirmed) {
                return;
            }

            localStorage.setItem(storageKey, "Published");

            statusElement.textContent = "Published";

            publishMessage.textContent =
                "The clip was published successfully.";

            publishButton.disabled = true;
            publishButton.textContent = "Published";
        });
    });
});