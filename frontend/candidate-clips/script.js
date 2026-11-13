
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

 let currentClipIndex = 0;

 
    const reviewQueueBtn = document.getElementById("review-queue-btn");
    const startingQueueCount = 12;

    function updateReviewQueueCount() {
        const reviewedCount = candidateClips.filter(
            clip => clip.status === "confirmed" || clip.status === "rejected"
        ).length;

        const remainingCount = Math.max(0, startingQueueCount - reviewedCount);

        reviewQueueBtn.textContent = `+ Review Queue · ${remainingCount}`;
    }


 
const statusFilter = document.getElementById("status-filter");


statusFilter.addEventListener("change", function () {
    const selectedStatus = statusFilter.value;

    const matchingClips = candidateClips
        .map((clip, index) => ({
            index: index,
            status: clip.status
        }))
        .filter(clip =>
            selectedStatus === "all" ||
            clip.status === selectedStatus
        );

    
        
        // Show only pagination buttons matching the selected status
        document.querySelectorAll(".pagination [data-clip-index]")
            .forEach(button => {
                const clipIndex = Number(button.dataset.clipIndex);

                const isMatch = matchingClips.some(
                    clip => clip.index === clipIndex
                );

                button.hidden = !isMatch;
            });



    if (matchingClips.length > 0) {
        showClip(matchingClips[0].index);
    }

});


 
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
            
            confirmBtn.addEventListener("click", function () {
                updateClipStatus("confirmed");
            });

            rejectBtn.addEventListener("click", function () {
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

    
    // Update pagination after clips are removed
    document.querySelectorAll(".pagination [data-clip-index]")
        .forEach(button => {
            const clipIndex = Number(button.dataset.clipIndex);

            // Hide pages that no longer have a clip
            button.hidden = clipIndex >= candidateClips.length;

            // Highlight the current clip
            button.classList.toggle(
                "selected",
                clipIndex === currentClipIndex
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

            
        // Previous clip: skip hidden pages
        document.getElementById("prev-clip")
            .addEventListener("click", () => {
                const visibleIndexes = Array.from(
                    document.querySelectorAll(
                        ".pagination [data-clip-index]:not([hidden])"
                    )
                ).map(button => Number(button.dataset.clipIndex));

                const position = visibleIndexes.indexOf(currentClipIndex);

                if (position > 0) {
                    showClip(visibleIndexes[position - 1]);
                }
            });

        // Next clip: skip hidden pages
        document.getElementById("next-clip")
            .addEventListener("click", () => {
                const visibleIndexes = Array.from(
                    document.querySelectorAll(
                        ".pagination [data-clip-index]:not([hidden])"
                    )
                ).map(button => Number(button.dataset.clipIndex));

                const position = visibleIndexes.indexOf(currentClipIndex);

                if (position !== -1 && position < visibleIndexes.length - 1) {
                    showClip(visibleIndexes[position + 1]);
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

