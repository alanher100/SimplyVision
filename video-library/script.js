// ===== Placeholder data (real data arrives with SV-65) =====
const clips = [
  // failsRemaining = how many more times a download fails before it works, just for example of failed state the first download video fails to show what it looks like and the seccond gives success! 
  //Second downloadable video gives success on first try.
  // After Clip 1 already "failed" once (the banner on page load), so one more retry fails, then it succeeds.
  { id: 1, title: "Full-Court Transition Finish", meta: "Falcons vs. Northside — Q4", failsRemaining: 1 },
  { id: 2, title: "Game-Winning Corner Three", meta: "Falcons vs. Northside — Q4", failsRemaining: 0 }
];

const storage = { usedGB: 34.2, totalGB: 50 };

// Page elements
const banner = document.getElementById("download-banner");
const bannerText = document.getElementById("banner-text");
const retryButton = document.getElementById("retry-button");
const dismissButton = document.getElementById("dismiss-button");
const clipGrid = document.getElementById("clip-grid");
const toast = document.getElementById("toast");

let failedClip = null;
let bannerTimer;
let toastTimer;

// Toast messages 
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
}

// Banner 
function setBanner(strongText, message, isSuccess) {
  const strong = document.createElement("strong");
  strong.textContent = strongText;
  bannerText.replaceChildren(strong, document.createTextNode(" — " + message));
  banner.classList.toggle("success", isSuccess);
  retryButton.hidden = isSuccess;
  banner.hidden = false;
}

function showError(clip) {
  failedClip = clip;
  clearTimeout(bannerTimer);
  setBanner(
    "Download failed",
    "\u201C" + clip.title + "\u201D couldn\u2019t be downloaded. Check your connection and try again.",
    false
  );
}

function showSuccess(clip) {
  failedClip = null;
  setBanner("Download complete", "\u201C" + clip.title + "\u201D was saved to your device.", true);
  clearTimeout(bannerTimer);
  bannerTimer = setTimeout(() => { banner.hidden = true; }, 5000);
}

// Simulated download (real download arrives with SV-62)
function simulateDownload(clip) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (clip.failsRemaining > 0) {
        clip.failsRemaining--;
        resolve(false);
      } else {
        resolve(true);
      }
    }, 1200);
  });
}

function markDownloaded(clip) {
  const button = document.querySelector('[data-clip-id="' + clip.id + '"] .download-button');
  button.textContent = "Downloaded \u2713";
  button.classList.add("done");
}

async function runDownload(clip, trigger, busyLabel) {
  const cardButton = document.querySelector('[data-clip-id="' + clip.id + '"] .download-button');
  const originalLabel = trigger.textContent;

  retryButton.disabled = true;
  cardButton.disabled = true;
  trigger.textContent = busyLabel;

  const ok = await simulateDownload(clip);

  retryButton.disabled = false;
  cardButton.disabled = false;
  trigger.textContent = originalLabel;

  if (ok) {
    showSuccess(clip);
    markDownloaded(clip);
    showToast("Downloaded: " + clip.title);
  } else {
    showError(clip);
  }
}

// Clip cards
function renderClips() {
  clips.forEach((clip) => {
    const card = document.createElement("div");
    card.className = "clip-placeholder";
    card.dataset.clipId = clip.id;

    const thumb = document.createElement("div");
    thumb.className = "clip-thumb";

    const title = document.createElement("p");
    title.className = "clip-title";
    title.textContent = clip.title;

    const meta = document.createElement("p");
    meta.className = "clip-meta";
    meta.textContent = clip.meta;

    const actions = document.createElement("div");
    actions.className = "clip-actions";

    const downloadButton = document.createElement("button");
    downloadButton.className = "download-button";
    downloadButton.type = "button";
    downloadButton.textContent = "Download";
    downloadButton.addEventListener("click", (event) => {
      event.stopPropagation();
      runDownload(clip, downloadButton, "Downloading\u2026");
    });

    actions.appendChild(downloadButton);
    card.append(thumb, title, meta, actions);

    // PLACEHOLDER: Clip Details page (SV-51) is not built yet.
    card.addEventListener("click", () => {
      showToast("Clip Details (SV-51) isn't built yet.");
    });

    clipGrid.appendChild(card);
  });
}

// Storage indicator in sidebar
function renderStorage() {
  const percent = Math.round((storage.usedGB / storage.totalGB) * 100);
  document.getElementById("storage-percent").textContent = percent + "%";
  document.getElementById("storage-fill").style.width = percent + "%";
  document.getElementById("storage-detail").textContent =
    storage.usedGB + " GB of " + storage.totalGB + " GB used";
}

// Events
retryButton.addEventListener("click", () => {
  if (failedClip) {
    runDownload(failedClip, retryButton, "Retrying\u2026");
  }
});

dismissButton.addEventListener("click", () => {
  banner.hidden = true;
  clearTimeout(bannerTimer);
});

// PLACEHOLDER links: stay on this page and say the page isn't built yet
document.querySelectorAll(".placeholder-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showToast(link.dataset.page + " isn't built yet.");
  });
});

// Start!
renderStorage();
renderClips();
showError(clips[0]); // matches the Figma mockup: the page opens with the error showing (we can also get rid of it with x button)