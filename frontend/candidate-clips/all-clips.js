
const candidateClips = [
    {
        player: "Marcus Reed · #11",
        game: "West Campus High School vs Davis Senior High School",
        time: "Q2 · 02:14 game time · 00:12 clip",
        status: "pending"
    },
    {
        player: "Jordan Carter · #23",
        game: "Sacramento High School vs Elk Grove High School",
        time: "Q3 · 04:32 game time · 00:09 clip",
        status: "pending"
    },
    {
        player: "Alex Johnson · #7",
        game: "Rocklin High School vs Folsom High School",
        time: "Q1 · 06:18 game time · 00:11 clip",
        status: "pending"
    }
];


const savedStatuses = JSON.parse(
    localStorage.getItem("simplyvision-clip-statuses") || "null"
);

if (Array.isArray(savedStatuses)) {
    candidateClips.forEach((clip, index) => {
        if (["pending", "confirmed", "rejected"].includes(savedStatuses[index])) {
            clip.status = savedStatuses[index];
        }
    });
}


    const clipsContainer = document.getElementById("all-clips-container");

    candidateClips.forEach(clip => {
        const card = document.createElement("div");
        card.className = "all-clip-card";

        const player = document.createElement("h3");
        player.textContent = clip.player;

        const game = document.createElement("p");
        game.textContent = clip.game;

        const time = document.createElement("p");
        time.textContent = clip.time;

        const status = document.createElement("p");
        
        status.textContent =
            clip.status.charAt(0).toUpperCase() + clip.status.slice(1);

        status.className = `clip-status-badge ${clip.status}`;


        card.appendChild(player);
        card.appendChild(game);
        card.appendChild(time);
        card.appendChild(status);

        clipsContainer.appendChild(card);
    });


    document.getElementById("pending-count").textContent =
        candidateClips.filter(clip => clip.status === "pending").length;

    document.getElementById("confirmed-count").textContent =
        candidateClips.filter(clip => clip.status === "confirmed").length;

    document.getElementById("rejected-count").textContent =
        candidateClips.filter(clip => clip.status === "rejected").length;

    
    // Show completion banner when all clips are reviewed
    const allClipsComplete = document.getElementById("all-clips-complete");

    const allReviewed =
        candidateClips.length > 0 &&
        candidateClips.every(clip =>
            clip.status === "confirmed" || clip.status === "rejected"
        );

    allClipsComplete.hidden = !allReviewed;


    // SimplyVision Log Out button
    const logoutButton = document.getElementById("logoutButton");

    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            window.location.href = "../login.html?logout=preview";
        });
    }

