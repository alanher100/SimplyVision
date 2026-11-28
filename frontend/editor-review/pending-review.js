document.querySelectorAll(".pending-clip-row").forEach(function (row) {
    const clipNumber = row.dataset.clip;
    const statusElement = row.querySelector(".clip-status");

    const savedStatus = localStorage.getItem(
        `clip-${clipNumber}-status`
    );

    if (savedStatus && statusElement) {
        statusElement.textContent = savedStatus;
        statusElement.classList.remove("status-pending");
        statusElement.classList.add("status-updated");
    }
});