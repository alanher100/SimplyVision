document
    .querySelectorAll(".pending-clip-row")
    .forEach(function (row) {
        const clipNumber = row.dataset.clip;
        const savedStatus = localStorage.getItem(
            `clip-${clipNumber}-status`
        );

        if (savedStatus) {
            const statusElement = row.querySelector(
                ".status-pending"
            );

            statusElement.textContent = savedStatus;
            statusElement.classList.add("status-updated");
        }
    });