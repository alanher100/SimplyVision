document.addEventListener("DOMContentLoaded", function () {
    const rejectedList = document.querySelector("#rejected-list");

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

    const rejectedClips = clips.filter(function (clip) {
        const status = localStorage.getItem(
            `clip-${clip.number}-status`
        );

        return status === "Rejected";
    });

    if (rejectedClips.length === 0) {
        const message = document.createElement("p");

        message.textContent =
            "There are no rejected clips to display.";

        message.className = "delete-message";

        rejectedList.appendChild(message);

        return;
    }

    rejectedClips.forEach(function (clip) {
        const storageKey = `clip-${clip.number}-status`;

        const article = document.createElement("article");

        article.className = "rejected-clip-card";

        article.innerHTML = `
            <img
                class="rejected-thumbnail"
                src="../assets/basketball-banner.jpg"
                alt="Rejected basketball clip"
            >

            <div class="rejected-details">
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
                    <strong>Status:</strong>
                    <span class="rejected-status">
                        Rejected
                    </span>
                </p>

                <p>
                    <strong>Reason:</strong>
                    Not provided
                </p>

                <p>
                    <strong>Comments:</strong>
                    No additional comments.
                </p>
            </div>

            <div class="rejected-actions">
                <a
                    class="review-rejection-button"
                    href="clip-review.html?clip=${clip.number}"
                >
                    Review Rejection
                </a>

                <button
                    class="delete-button"
                    type="button"
                >
                    Delete
                </button>
            </div>
        `;

        rejectedList.appendChild(article);

        const deleteButton = article.querySelector(
            ".delete-button"
        );

        deleteButton.addEventListener("click", function () {
            const confirmed = window.confirm(
                "Move this rejected clip to the Delete List?"
            );

            if (!confirmed) {
                return;
            }

            localStorage.setItem(
                storageKey,
                "Pending Deletion"
            );

            window.location.href =
                `delete-list.html?clip=${clip.number}`;
        });
    });
});