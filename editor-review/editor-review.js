document.addEventListener("DOMContentLoaded", function () {
    const summaryCards = document.querySelector(".summary_cards");
    const pendingSection = document.querySelector(".pending_section");

    const pageView = document.createElement("section");

    pageView.className = "page_view";
    pageView.hidden = true;

    pageView.innerHTML = `
        <h2 id="page_title"></h2>
        <p id="page_description"></p>
        <button id="back_button" type="button">
            Back to Dashboard
        </button>
    `;

    document.querySelector(".content").appendChild(pageView);

    const pageInformation = {
        pending: {
            title: "Pending Clips",
            description: "These clips are waiting for editor review."
        },
        correction: {
            title: "Needs Correction",
            description: "These clips need changes before they can be approved."
        },
        approve: {
            title: "Approved Clips",
            description: "These clips have been approved."
        },
        reject: {
            title: "Rejected Clips",
            description: "These clips have been rejected."
        }
    };

    function showPage(pageName) {
        const selectedPage = pageInformation[pageName];

        if (!selectedPage) {
            return;
        }

        pageView.querySelector("#page_title").textContent =
            selectedPage.title;

        pageView.querySelector("#page_description").textContent =
            selectedPage.description;

        summaryCards.hidden = true;
        pendingSection.hidden = true;
        pageView.hidden = false;
    }

    function showDashboard() {
        summaryCards.hidden = false;
        pendingSection.hidden = false;
        pageView.hidden = true;
    }

    document.querySelectorAll(".card_action").forEach(function (button) {
        button.addEventListener("click", function () {
            const buttonText = button
                .querySelector("span")
                .textContent
                .trim();

            if (buttonText === "Pending") {
                showPage("pending");
            } else if (buttonText === "Approve") {
                showPage("approve");
            } else if (buttonText === "Needs Correction") {
                showPage("correction");
            } else if (buttonText === "Reject") {
                showPage("reject");
            }
        });
    });

    document.querySelectorAll(".review_button").forEach(function (button) {
        button.addEventListener("click", function () {
            showPage("pending");
        });
    });

    pageView
        .querySelector("#back_button")
        .addEventListener("click", function () {
            showDashboard();
        });
});