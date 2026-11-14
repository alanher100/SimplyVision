
 // Sample candidate clips for Sprint 2
 // Frontend-only mock data (no database yet)

 let candidateClips = [
     {
         player: "Marcus Reed · #11",
         game: "West Campus High School vs Davis Senior High School",
         time: "Q2 · 02:14 game time · 00:12 clip",
         stats: [
             ["+2 Points", "92%"],
             ["Made Field Goal", "89%"],
             ["Fast Break", "81%"]
         ],
         labels: ["Made Shot", "2PT", "Fast Break"],
         status: "pending"
     },
     {
         player: "Jordan Carter · #23",
         game: "Sacramento High School vs Elk Grove High School",
         time: "Q3 · 04:32 game time · 00:09 clip",
         stats: [
             ["+3 Points", "94%"],
             ["Made Field Goal", "91%"],
             ["Three Pointer", "87%"]
         ],
         labels: ["Made Shot", "3PT", "Three Pointer"],
         status: "pending"
        },
     {
         player: "Alex Johnson · #7",
         game: "Rocklin High School vs Folsom High School",
         time: "Q1 · 06:18 game time · 00:11 clip",
         stats: [
             ["Rebound", "90%"],
             ["Defensive Rebound", "86%"],
             ["Possession Change", "82%"]
         ],
         labels: ["Rebound", "Defensive Play"],
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



 let currentClipIndex = 0;


 // Sprint 3: Populate the game filter
const gameFilter = document.getElementById("game-filter");


 // Sprint 3: Populate the player filter
const playerFilter = document.getElementById("player-filter");

const players = [...new Set(candidateClips.map(clip => clip.player))];

players.forEach(player => {
    const option = document.createElement("option");
    option.value = player;
    option.textContent = player;
    playerFilter.appendChild(option);
});



playerFilter.addEventListener("change", applyFilters);




// Get all unique games from the candidate clips
const games = [...new Set(candidateClips.map(clip => clip.game))];

// Add each game to the dropdown
games.forEach(game => {
    const option = document.createElement("option");
    option.value = game;
    option.textContent = game;
    gameFilter.appendChild(option);
});



gameFilter.addEventListener("change", applyFilters);



 
    const reviewQueueBtn = document.getElementById("review-queue-btn");
    const startingQueueCount = candidateClips.length;

    function updateReviewQueueCount() {
        const reviewedCount = candidateClips.filter(
            clip => clip.status === "confirmed" || clip.status === "rejected"
        ).length;

        const remainingCount = Math.max(0, startingQueueCount - reviewedCount);

        reviewQueueBtn.textContent = `+ Review Queue · ${remainingCount}`;

        
        const sidebarClipCount = document.getElementById("sidebar-clip-count");

        if (sidebarClipCount) {
            sidebarClipCount.textContent = remainingCount;
            sidebarClipCount.hidden = remainingCount === 0;
        }

    }

    // Show the correct review queue count when the page loads
    updateReviewQueueCount();

    // Update the sidebar count after the reusable sidebar loads
    document.addEventListener("sidebar:loaded", () => {
        updateReviewQueueCount();
    });


 
const statusFilter = document.getElementById("status-filter");




function applyFilters() {
    const searchText = document
        .getElementById("clip-search")
        .value.trim().toLowerCase();

    const matchingIndexes = candidateClips
        .map((clip, index) => ({ clip, index }))
        .filter(({ clip }) =>
            (gameFilter.value === "all" ||
             clip.game === gameFilter.value) &&
            (playerFilter.value === "all" ||
             clip.player === playerFilter.value) &&
            
            (statusFilter.value === "all" ||
            clip.status === statusFilter.value) &&
            (
                clip.player.toLowerCase().includes(searchText) ||
                clip.game.toLowerCase().includes(searchText) ||
                clip.time.toLowerCase().includes(searchText)
            )

        )
        
        .map(({ index }) => index)
        .sort((a, b) => {
            const sortOrder = document.getElementById("sort-order").value;

            return sortOrder === "newest" ? b - a : a - b;
        });


   

    const reviewArea = document.querySelector(".review-area");

    if (matchingIndexes.length === 0) {
        reviewArea.style.display = "none";
    } else {
        reviewArea.style.display = "";

        const index = matchingIndexes[0];

       
    }

     
    
    // Update pagination numbers to match the sorted order
    const pageButtons = document.querySelectorAll(
        ".pagination [data-clip-index]"
    );

    pageButtons.forEach((button, position) => {
        const clipIndex = matchingIndexes[position];

        button.hidden = clipIndex === undefined;

        if (clipIndex !== undefined) {
            button.dataset.clipIndex = clipIndex;
            button.textContent = position + 1;
        }
    });

    if (matchingIndexes.length > 0) {
        showClip(matchingIndexes[0]);
    }

}

statusFilter.addEventListener("change", applyFilters);


document.getElementById("sort-order")
    .addEventListener("change", applyFilters);


document.getElementById("clip-search")
    .addEventListener("input", applyFilters);


 
// Elements that display the current clip information
const clipPlayer = document.getElementById("clip-player");
const clipGame = document.getElementById("clip-game");
const clipTime = document.getElementById("clip-time");

function updateClipInfo(clip) {
    clipPlayer.textContent = clip.player;
    clipGame.textContent = clip.game;
    clipTime.textContent = clip.time;
}


const clipStats = document.getElementById("clip-stats");

function updateClipStats(clip) {
    clipStats.innerHTML = "";

    clip.stats.forEach(([stat, confidence]) => {
        const row = document.createElement("div");
        row.className = "stat-row";

        const statName = document.createElement("span");
        statName.textContent = stat;

        const statConfidence = document.createElement("strong");
        statConfidence.textContent = confidence;

        row.appendChild(statName);
        row.appendChild(statConfidence);

        clipStats.appendChild(row);
    });
}
    
        
        // Confirm and Reject functionality

        const confirmBtn = document.getElementById("confirmBtn");
        const rejectBtn = document.getElementById("rejectBtn");
        const clipStatus = document.getElementById("clipStatus");
        const reviewPanel = document.querySelector(".review-panel");
        
        const reviewMessage = document.getElementById("review-message");
        const reviewMessageTitle = document.getElementById("review-message-title");
        const reviewMessageDescription = document.getElementById("review-message-description");
        const actions = document.querySelector(".actions");


            
        function updateClipStatus(status) {

            // Remember the decision for the current clip
            candidateClips[currentClipIndex].status = status;

            localStorage.setItem(
                "simplyvision-clip-statuses",
                JSON.stringify(candidateClips.map(clip => clip.status))
            );


            // Update the remaining review queue count
            updateReviewQueueCount();

            
            // Keep the status filter consistent after a review decision
            if (
                statusFilter.value !== "all" &&
                statusFilter.value !== status
            ) {
                statusFilter.value = "all";
            }


            if (status === "confirmed") {
                clipStatus.textContent = "✓ Confirmed";
                clipStatus.style.color = "#228b22";
                reviewPanel.style.borderColor = "#228b22";

                reviewMessageTitle.textContent = "✓ Clip confirmed";
                reviewMessageDescription.textContent = "Statistics and labels saved.";
            }

            if (status === "rejected") {
                clipStatus.textContent = "✕ Rejected";
                clipStatus.style.color = "#d93025";
                reviewPanel.style.borderColor = "#d93025";

                reviewMessageTitle.textContent = "✕ Clip rejected";
                reviewMessageDescription.textContent =
                "This candidate will not be added to the approved clip library.";
            }

            // Show the appropriate notification banner
            reviewMessage.classList.remove("confirmed", "rejected");
            reviewMessage.classList.add(status);
            reviewMessage.hidden = false;

            // Prevent further edits
            confirmBtn.disabled = true;
            rejectBtn.disabled = true;
            addBtn.disabled = true;
            closeLabelForm();

            // Replace the review buttons with Review Next Clip
            actions.innerHTML = "";

            const nextBtn = document.createElement("button");
            nextBtn.type = "button";
            nextBtn.textContent = "Review Next Clip →";
            nextBtn.className = "next-clip-btn";

            actions.appendChild(nextBtn);

            
            nextBtn.addEventListener("click", () => {
                // Move to the next sample clip
                
                const nextPendingIndex = candidateClips.findIndex(
                    (clip, index) =>
                        clip.status === "pending" && index > currentClipIndex
                );

                const firstPendingIndex = candidateClips.findIndex(
                    clip => clip.status === "pending"
                );

                
                if (firstPendingIndex === -1) {
                    reviewMessage.classList.remove("confirmed", "rejected");
                    reviewMessage.classList.add("completed");

                    // Match the review panel border to the blue banner
                    reviewPanel.style.borderColor = "#8BB8E8";

                    reviewMessageTitle.textContent = "✓ All Clips Reviewed!";
                    reviewMessageDescription.textContent =
                        "You've finished reviewing all candidate clips.";

                    reviewMessage.hidden = false;

                    
                    nextBtn.disabled = true;
                    nextBtn.textContent = "Review Complete ✓";

                    const viewAllBtn = document.createElement("a");
                    viewAllBtn.href = "all-clips.html";
                    viewAllBtn.className = "view-all-clips-btn";
                    viewAllBtn.textContent = "View All Clips →";
                    actions.appendChild(viewAllBtn);

                    return;

                }


                currentClipIndex =
                    nextPendingIndex !== -1 ? nextPendingIndex : firstPendingIndex;

                const nextClip = candidateClips[currentClipIndex];

                
                // Reset the filter so the next pending clip is visible
                statusFilter.value = "all";

                // Update the clip and selected pagination number
                showClip(currentClipIndex);

                // Reset the review status
                clipStatus.textContent = "Needs Review";
                clipStatus.style.color = "";
                reviewPanel.style.borderColor = "";
                reviewMessage.hidden = true;
                reviewMessage.classList.remove("confirmed", "rejected");

                // Re-enable editing
                addBtn.disabled = false;
                closeLabelForm();

                // Restore Confirm and Reject buttons
                confirmBtn.disabled = false;
                rejectBtn.disabled = false;
                actions.replaceChildren(rejectBtn, confirmBtn);
            });
        }
            
            
        const confirmModal = document.getElementById("confirm-modal");
        const cancelConfirmBtn = document.getElementById("cancel-confirm");
        const approveConfirmBtn = document.getElementById("approve-confirm");

        confirmBtn.addEventListener("click", function () {
            confirmModal.hidden = false;
        });

        cancelConfirmBtn.addEventListener("click", function () {
            confirmModal.hidden = true;
        });

        approveConfirmBtn.addEventListener("click", function () {
            confirmModal.hidden = true;
            updateClipStatus("confirmed");
        });


            
        const rejectModal = document.getElementById("reject-modal");
        const cancelRejectBtn = document.getElementById("cancel-reject");
        const approveRejectBtn = document.getElementById("approve-reject");

        rejectBtn.addEventListener("click", function () {
            rejectModal.hidden = false;
        });

        cancelRejectBtn.addEventListener("click", function () {
            rejectModal.hidden = true;
        });

        approveRejectBtn.addEventListener("click", function () {
            rejectModal.hidden = true;
            updateClipStatus("rejected");
        });

            

        // Add Event Label functionality

        const addBtn = document.getElementById("add-label-btn");
        const labelForm = document.getElementById("label-form");
        const labelInput = document.getElementById("new-label");
        const saveBtn = document.getElementById("save-label-btn");
        const cancelBtn = document.getElementById("cancel-label-btn");
        const tags = document.getElementById("event-tags");

        
        function updateClipLabels(clip) {
            // Remove the labels from the previous clip
            tags.querySelectorAll("span").forEach(tag => tag.remove());

            // Add the labels for the new clip
            clip.labels.forEach(label => {
                const newTag = document.createElement("span");
                newTag.textContent = "■ " + label + " ";

                const removeBtn = document.createElement("button");
                removeBtn.type = "button";
                removeBtn.className = "remove-label";
                removeBtn.textContent = "×";
                removeBtn.setAttribute("aria-label", "Remove " + label);

                newTag.appendChild(removeBtn);

                // Keep the + Add button at the end
                tags.insertBefore(newTag, addBtn);
            });
        }


        
        function showClip(index) {
            currentClipIndex = index;
            const clip = candidateClips[currentClipIndex];

            
            // Restore the selected clip's review status
            if (clip.status === "confirmed") {
                clipStatus.textContent = "✓ Confirmed";
                clipStatus.style.color = "#228b22";
            } else if (clip.status === "rejected") {
                clipStatus.textContent = "✕ Rejected";
                clipStatus.style.color = "#d93025";
            } else {
                clipStatus.textContent = "● Needs Review";
                clipStatus.style.color = "";
            }

            
            // Reset the review panel when changing clips
            reviewMessage.hidden = true;
            reviewMessage.classList.remove("confirmed", "rejected", "completed");
            reviewPanel.style.borderColor = "";

            closeLabelForm();

            
            if (clip.status === "pending") {
                // Allow reviewing a pending clip
                confirmBtn.disabled = false;
                rejectBtn.disabled = false;
                addBtn.disabled = false;
                actions.replaceChildren(rejectBtn, confirmBtn);

            } else {
                // Lock an already-reviewed clip
                confirmBtn.disabled = true;
                rejectBtn.disabled = true;
                addBtn.disabled = true;
                actions.replaceChildren();

                
                // Show Review Next Clip on already-reviewed clips
                const nextBtn = document.createElement("button");
                nextBtn.type = "button";
                nextBtn.className = "next-clip-btn";
                nextBtn.textContent = "Review Next Clip →";

                actions.appendChild(nextBtn);


                
                nextBtn.addEventListener("click", () => {
                    // Find the next pending clip after the current one
                    const nextPendingIndex = candidateClips.findIndex(
                        (candidate, index) =>
                            candidate.status === "pending" && index > currentClipIndex
                    );

                    // If none is ahead, start searching from the beginning
                    const firstPendingIndex = candidateClips.findIndex(
                        candidate => candidate.status === "pending"
                    );

                    if (firstPendingIndex === -1) {
                        // Every clip has already been reviewed
                        reviewMessage.classList.remove("confirmed", "rejected");
                        reviewMessage.classList.add("completed");

                        reviewPanel.style.borderColor = "#8BB8E8";
                        reviewMessageTitle.textContent = "✓ All Clips Reviewed!";
                        reviewMessageDescription.textContent =
                            "You've finished reviewing all candidate clips.";

                        reviewMessage.hidden = false;
                        nextBtn.disabled = true;
                        nextBtn.textContent = "Review Complete ✓";
                        
                        
                        const viewAllBtn = document.createElement("a");
                        viewAllBtn.href = "all-clips.html";
                        viewAllBtn.className = "view-all-clips-btn";
                        viewAllBtn.textContent = "View All Clips →";
                        actions.appendChild(viewAllBtn);
                        
                        return;
                    }

                    // Open the next pending clip and update pagination
                    showClip(
                        nextPendingIndex !== -1 ? nextPendingIndex : firstPendingIndex
                    );
                });


            if (clip.status === "confirmed") {
                reviewMessageTitle.textContent = "✓ Clip confirmed";
                reviewMessageDescription.textContent =
                    "Statistics and labels saved.";
                reviewPanel.style.borderColor = "#228b22";

            } else if (clip.status === "rejected") {
                reviewMessageTitle.textContent = "✕ Clip rejected";
                reviewMessageDescription.textContent =
                    "This candidate will not be added to the approved clip library.";
                reviewPanel.style.borderColor = "#d93025";
            }
        

        reviewMessage.classList.add(clip.status);
        reviewMessage.hidden = false;
    }

    // Update the selected clip's information
    updateClipInfo(clip);
    updateClipStats(clip);
    updateClipLabels(clip);

    
    // Highlight the correct page number for the current clip
    document.querySelectorAll(".pagination [data-clip-index]")
        .forEach(button => {
            button.classList.toggle(
                "selected",
                Number(button.dataset.clipIndex) === currentClipIndex
            );
        });

    
    }
    

            
    // Pagination: click a page number to view that clip
        document.querySelectorAll(".pagination [data-clip-index]")
            .forEach(button => {
                button.addEventListener("click", () => {
                    showClip(Number(button.dataset.clipIndex));
                });
            });

            // Apply sorting after pagination buttons are ready
            applyFilters();

            
        
            
            // Previous arrow: move backward through displayed page numbers
            document.getElementById("prev-clip")
                .addEventListener("click", () => {
                    const pageButtons = Array.from(
                        document.querySelectorAll(
                            ".pagination [data-clip-index]:not([hidden])"
                        )
                    );

                    const currentPosition = pageButtons.findIndex(
                        button => Number(button.dataset.clipIndex) === currentClipIndex
                    );

                    if (currentPosition > 0) {
                        pageButtons[currentPosition - 1].click();
                    }
                });



        
             
                // Next arrow: move forward through displayed page numbers
                document.getElementById("next-clip")
                    .addEventListener("click", () => {
                        const pageButtons = Array.from(
                            document.querySelectorAll(
                                ".pagination [data-clip-index]:not([hidden])"
                            )
                        );

                        const currentPosition = pageButtons.findIndex(
                            button => Number(button.dataset.clipIndex) === currentClipIndex
                        );

                        if (currentPosition !== -1 &&
                            currentPosition < pageButtons.length - 1) {
                            pageButtons[currentPosition + 1].click();
                        }
                    });






        function closeLabelForm() {
            labelInput.value = "";
            labelForm.hidden = true;
            addBtn.setAttribute("aria-expanded", "false");
        }

        addBtn.addEventListener("click", function () {
            labelForm.hidden = false;
            addBtn.setAttribute("aria-expanded", "true");
            labelInput.focus();
        });

        saveBtn.addEventListener("click", function () {
            const label = labelInput.value.trim();

            if (label === "") {
                alert("Please enter an event label.");
                labelInput.focus();
                return;
            }

            // Check for duplicate labels
            const existingLabels = Array.from(
                tags.querySelectorAll("span")
            ).map(function (span) {
                return span.textContent
                    .replace(/^■\s*/, "")
                    .trim()
                    .toLowerCase();
            });

            if (existingLabels.includes(label.toLowerCase())) {
                alert("This event label already exists.");
                labelInput.focus();
                return;
            }

            
            // Create the new event label
            const newTag = document.createElement("span");
            newTag.textContent = "■ " + label + " ";

            // Create a remove button for the label
            const removeBtn = document.createElement("button");
            removeBtn.type = "button";
            removeBtn.className = "remove-label";
            removeBtn.textContent = "×";
            removeBtn.setAttribute("aria-label", "Remove " + label);

            // Add the remove button inside the label
            newTag.appendChild(removeBtn);

            // Insert the new label before the Add button
            tags.insertBefore(newTag, addBtn);

            closeLabelForm();

        });

        cancelBtn.addEventListener("click", function () {
            closeLabelForm();
        });

        // Allow Enter to save and Escape to cancel
        labelInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                saveBtn.click();
            }

            if (event.key === "Escape") {
                closeLabelForm();
                addBtn.focus();
            }
        });
    

        
        // Remove an event label before confirming or rejecting

        tags.addEventListener("click", function (event) {
            const removeButton = event.target.closest(".remove-label");

            if (!removeButton || addBtn.disabled) {
                return;
            }

            removeButton.closest("span").remove();
        });


        
        // Export candidate clips to CSV
        const exportBtn = document.getElementById("export-btn");

        exportBtn.addEventListener("click", function () {
            const rows = [
                ["Player", "Game", "Clip Time", "Statistics", "Event Labels", "Status"]
            ];

            candidateClips.forEach(clip => {
                rows.push([
                    clip.player,
                    clip.game,
                    clip.time,
                    clip.stats.map(stat => stat.join(" (") + ")").join("; "),
                    clip.labels.join("; "),
                    clip.status
                ]);
            });

            // Escape values so commas and quotes work correctly in CSV
            const csv = rows.map(row =>
                row.map(value =>
                    '"' + String(value).replace(/"/g, '""') + '"'
                ).join(",")
            ).join("\r\n");

            const blob = new Blob([csv], {
                type: "text/csv;charset=utf-8;"
            });

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = "simplyvision-candidate-clips.csv";
            link.click();

            URL.revokeObjectURL(url);
        });


        
            
// SimplyVision custom Delete confirmation popup
const deleteBtn = document.getElementById("delete-btn");
const deleteModal = document.getElementById("delete-modal");
const deleteModalMessage = document.getElementById("delete-modal-message");
const cancelDeleteBtn = document.getElementById("cancel-delete");
const confirmDeleteBtn = document.getElementById("confirm-delete");

// Open the custom popup
deleteBtn.addEventListener("click", function () {
    const clip = candidateClips[currentClipIndex];

    deleteModalMessage.textContent =
        `Are you sure you want to delete the clip for ${clip.player}?`;

    deleteModal.hidden = false;
});

// Close the popup without deleting
cancelDeleteBtn.addEventListener("click", function () {
    deleteModal.hidden = true;
});

// Sprint 3 placeholder — no clip is deleted yet
confirmDeleteBtn.addEventListener("click", function () {
    deleteModal.hidden = true;
    alert("Clip deletion will be available in Sprint 3.");
});






