document.addEventListener("DOMContentLoaded", function () {
    const summaryCards = document.querySelector(".summary_cards");
    const pendingSection = document.querySelector(".pending_section");
    const content = document.querySelector(".content");

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

    content.appendChild(pageView);

    const pageInformation = {
        correction: {
            title: "Needs Correction",
            description:
                "These clips need changes before they can be approved."
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

    document
        .querySelectorAll("button.card_action")
        .forEach(function (button) {
            button.addEventListener("click", function () {
                const buttonText = button
                    .querySelector("span")
                    .textContent
                    .trim();

                if (buttonText === "Needs Correction") {
                    showPage("correction");
                } else if (buttonText === "Reject") {
                    showPage("reject");
                }
            });
        });

    document
        .querySelector("#back_button")
        .addEventListener("click", function () {
            showDashboard();
        });
});