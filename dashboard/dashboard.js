// SV-90: Dashboard UI enhancements (profile menu, delete confirmation, empty state)
// Frontend prototype only. Uses the sample rows on the page, no database needed.

document.addEventListener("DOMContentLoaded", function () {
    const $ = (id) => document.getElementById(id);
    const UPLOAD_PAGE = "../upload-footage-review/uploadfootage.html";
    const REVIEW_PAGE = "../frontend/editor-review/editor-review.html";

    // Buttons that open other pages
    $("uploadButton").addEventListener("click", () => { window.location.href = UPLOAD_PAGE; });
    document.querySelectorAll(".review-btn").forEach((btn) => {
        btn.addEventListener("click", () => { window.location.href = REVIEW_PAGE; });
    });

    // Profile dropdown: My Profile, Settings, Sign Out
    const profileButton = $("profileButton");
    const dropdown = $("profileDropdown");
    function setMenu(open) {
        dropdown.hidden = !open;
        profileButton.setAttribute("aria-expanded", String(open));
    }
    profileButton.addEventListener("click", (e) => { e.stopPropagation(); setMenu(dropdown.hidden); });
    dropdown.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("click", (e) => { if (!dropdown.contains(e.target)) setMenu(false); });

    // Delete confirmation dialog
    const modal = $("deleteModal");
    const list = $("footageList");
    const emptyState = $("emptyState");
    const counterFor = { processing: "countProcessing", review: "countReview", approved: "countApproved" };
    let pendingRow = null;

    function closeModal() { modal.hidden = true; pendingRow = null; }
    function adjust(id, change) {
        const el = $(id);
        if (el) el.textContent = Math.max(0, Number(el.textContent) + change);
    }

    list.addEventListener("click", (e) => {
        const btn = e.target.closest(".delete-btn");
        if (!btn) return;
        pendingRow = btn.closest(".row");
        const name = pendingRow.querySelector(".name").textContent;
        $("deleteMessage").textContent = '"' + name + '" will be removed from your dashboard. This can\'t be undone.';
        modal.hidden = false;
        $("cancelDelete").focus();
    });

    $("cancelDelete").addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") { setMenu(false); closeModal(); }
    });

    $("confirmDelete").addEventListener("click", () => {
        if (!pendingRow) return;
        adjust("countUploaded", -1);
        adjust(counterFor[pendingRow.dataset.status], -1);
        pendingRow.remove();
        closeModal();
        // Empty state when nothing is left
        if (!list.querySelector(".row")) {
            list.hidden = true;
            emptyState.hidden = false;
        }
    });
});
