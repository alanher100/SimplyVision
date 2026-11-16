// ===================================================================
// Video Library prototype (SV-40 / SV-46 / SV-56 / SV-61)
// Data comes from the Upload Footage page (upload-footage-review/uploadfootage.js),
// which saves each upload's details in localStorage under "simplyvisionVideos".
// The library only READS that key; it never changes a teammate's data.
// Deleted items are remembered in our own key so they stay deleted after refresh.
// ===================================================================

const UPLOADS_KEY = "simplyvisionVideos";            // written by the upload page
const DELETED_KEY = "simplyvision-library-deleted";  // written by the library (array of ids)

function readJSONArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch (err) {
    console.warn("Could not read " + key + " from localStorage", err);
    return [];
  }
}

function getDeletedIds() {
  return readJSONArray(DELETED_KEY).map(String);
}

function saveDeletedIds(ids) {
  try {
    localStorage.setItem(DELETED_KEY, JSON.stringify([...new Set(ids.map(String))]));
  } catch (err) {
    console.warn("Could not save deleted clips", err);
  }
}

// Turn one upload record into the shape the library cards expect.
function mapUploadToClip(upload, index) {
  const id = "upload-" + (upload.id || upload.uploadedAt || index);
  const home = (upload.homeTeam || "").trim();
  const away = (upload.awayTeam || "").trim();
  const matchup = home && away ? home + " vs " + away : (home || away);
  const date = upload.gameDate || (upload.uploadedAt || "").slice(0, 10);
  const details = [upload.gameLevel, upload.gender, upload.sport].filter(Boolean).join(" · ");

  return {
    id: id,
    title: matchup || upload.fileName || "Untitled upload",
    game: matchup || "Unknown game",
    player: "Unassigned",           // the upload form doesn't capture players yet
    number: null,
    details: details,
    gameID: upload.gameID || "",
    fileName: upload.fileName || "",
    date: date,
    uploadedAt: upload.uploadedAt || "",
    duration: null,                 // not captured on upload
    resolution: null,               // not captured on upload
    status: "Processing",           // raw footage waiting for AI processing / review
    sizeGB: (Number(upload.fileSize) || 0) / 1e9,
    thumb: null,
    failsRemaining: 0
  };
}

// The upload page gives every submit a brand-new random id, so submitting the
// same video for the same game more than once (e.g. while testing) leaves
// several records that look identical. We group those by their content and
// show ONE card (the newest). The card remembers every id in its group so a
// delete hides all of them, not just one.
function uploadSignature(u) {
  return [u.fileName, u.fileSize, u.gameID, u.gameDate, u.homeTeam, u.awayTeam]
    .map((v) => String(v == null ? "" : v).trim().toLowerCase())
    .join("|");
}

function loadClips() {
  const deleted = new Set(getDeletedIds());
  const groups = new Map(); // signature -> newest clip (with allIds)

  readJSONArray(UPLOADS_KEY).forEach((upload, index) => {
    const clip = mapUploadToClip(upload, index);
    if (deleted.has(clip.id)) return;

    const key = uploadSignature(upload);
    const existing = groups.get(key);
    if (!existing) {
      clip.allIds = [clip.id];
      groups.set(key, clip);
    } else {
      const allIds = existing.allIds.concat(clip.id);
      const newest = clip.uploadedAt > existing.uploadedAt ? clip : existing;
      newest.allIds = allIds;
      groups.set(key, newest);
    }
  });

  return [...groups.values()];
}

let clips = loadClips();

const storage = { usedGB: 0, totalGB: 50 };
function recalcStorage() {
  storage.usedGB = clips.reduce((sum, c) => sum + c.sizeGB, 0);
}
recalcStorage();
const PAGE_SIZE = 6;

// ----- State -----
const state = {
  search: "",
  game: "",
  player: "",
  status: "",
  sort: "newest",
  view: "grid",
  page: 1,
  selected: new Set(),
  pendingDelete: []   // clip ids waiting in the confirmation modal
};

// ----- Elements -----
const el = {
  grid: document.getElementById("clip-grid"),
  count: document.getElementById("clip-count"),
  search: document.getElementById("search-input"),
  filterGame: document.getElementById("filter-game"),
  filterPlayer: document.getElementById("filter-player"),
  filterStatus: document.getElementById("filter-status"),
  sort: document.getElementById("sort-by"),
  viewGrid: document.getElementById("view-grid"),
  viewList: document.getElementById("view-list"),
  exportBtn: document.getElementById("export-button"),
  bulkDeleteBtn: document.getElementById("bulk-delete-button"),
  pagination: document.getElementById("pagination"),
  empty: document.getElementById("empty-state"),
  emptyTitle: document.getElementById("empty-title"),
  emptyText: document.getElementById("empty-text"),
  emptyUpload: document.getElementById("empty-upload"),
  emptyClear: document.getElementById("empty-clear"),
  banner: document.getElementById("download-banner"),
  bannerText: document.getElementById("banner-text"),
  retry: document.getElementById("retry-button"),
  dismiss: document.getElementById("dismiss-button"),
  modal: document.getElementById("delete-modal"),
  modalTitle: document.getElementById("modal-title"),
  modalText: document.getElementById("modal-text"),
  modalCancel: document.getElementById("modal-cancel"),
  modalConfirm: document.getElementById("modal-confirm"),
  toast: document.getElementById("toast")
};

let failedClip = null;
let bannerTimer;
let toastTimer;

// ----- Helpers -----
function formatDuration(seconds) {
  if (seconds == null) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

function formatDate(iso) {
  if (!iso) return "No date";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d)) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function showToast(message) {
  el.toast.textContent = message;
  el.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.toast.classList.remove("show"), 2500);
}

// ----- Filtering, sorting, paging -----
function getVisibleClips() {
  const q = state.search.trim().toLowerCase();
  let list = clips.filter((c) => {
    if (state.game && c.game !== state.game) return false;
    if (state.player && c.player !== state.player) return false;
    if (state.status && c.status !== state.status) return false;
    const haystack = [c.title, c.game, c.player, c.details, c.gameID, c.fileName].join(" ").toLowerCase();
    if (q && !haystack.includes(q)) return false;
    return true;
  });

  // Newest/oldest use game date, then upload time as a tie-breaker.
  const when = (c) => c.date + "|" + c.uploadedAt;
  list.sort((a, b) => {
    switch (state.sort) {
      case "oldest":  return when(a).localeCompare(when(b));
      case "title":   return a.title.localeCompare(b.title);
      case "longest": return (b.duration || 0) - (a.duration || 0);
      default:        return when(b).localeCompare(when(a)); // newest
    }
  });
  return list;
}

function filtersActive() {
  return Boolean(state.search.trim() || state.game || state.player || state.status);
}

// ----- Rendering -----
function renderFilterOptions() {
  const fill = (select, values, label) => {
    const current = select.value;
    select.replaceChildren(new Option(label, ""));
    values.forEach((v) => select.appendChild(new Option(v, v)));
    select.value = values.includes(current) ? current : "";
  };
  fill(el.filterGame, [...new Set(clips.map((c) => c.game))].sort(), "All games");
  fill(el.filterPlayer, [...new Set(clips.map((c) => c.player))].sort(), "All players");
}

function renderStorage() {
  const percent = Math.round((storage.usedGB / storage.totalGB) * 100);
  document.getElementById("storage-percent").textContent = percent + "%";
  document.getElementById("storage-fill").style.width = percent + "%";
  document.getElementById("storage-detail").textContent =
    storage.usedGB.toFixed(1) + " GB of " + storage.totalGB + " GB used";
}

function renderBulkButtons() {
  const n = state.selected.size;
  el.exportBtn.disabled = n === 0;
  el.bulkDeleteBtn.disabled = n === 0;
  el.exportBtn.innerHTML = "&#8615; Export" + (n ? " (" + n + ")" : "");
  el.bulkDeleteBtn.innerHTML = "&#128465; Delete" + (n ? " (" + n + ")" : "");
}

function buildCard(clip) {
  const card = document.createElement("article");
  card.className = "clip-card" + (state.selected.has(clip.id) ? " selected" : "");
  card.dataset.clipId = clip.id;

  // Thumbnail
  const thumb = document.createElement("div");
  thumb.className = "clip-thumb";
  if (clip.thumb) {
    const img = document.createElement("img");
    img.src = clip.thumb;
    img.alt = clip.title;
    thumb.appendChild(img);
  } else {
    const court = document.createElement("div");
    court.className = "court";
    thumb.appendChild(court);
  }

  const check = document.createElement("button");
  check.type = "button";
  check.className = "clip-check";
  check.setAttribute("aria-label", "Select clip");
  check.textContent = state.selected.has(clip.id) ? "✓" : "";
  check.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleSelect(clip.id);
  });

  thumb.append(check);
  // Duration / resolution badges only when we actually know them
  if (clip.duration != null) {
    const duration = document.createElement("span");
    duration.className = "clip-badge clip-duration";
    duration.textContent = formatDuration(clip.duration);
    thumb.append(duration);
  }
  if (clip.resolution) {
    const res = document.createElement("span");
    res.className = "clip-badge clip-res";
    res.textContent = clip.resolution;
    thumb.append(res);
  }
  thumb.addEventListener("click", () => openDetails(clip));

  // Body
  const body = document.createElement("div");
  body.className = "clip-body";

  const info = document.createElement("div");
  info.className = "clip-info";

  const playerRow = document.createElement("div");
  playerRow.className = "clip-player";
  const playerName = document.createElement("span");
  const strong = document.createElement("strong");
  strong.textContent = clip.player;
  const extra = clip.number != null ? "#" + clip.number : clip.details;
  playerName.append(strong);
  if (extra) playerName.append(document.createTextNode(" · " + extra));
  const menu = document.createElement("button");
  menu.type = "button";
  menu.className = "clip-menu";
  menu.setAttribute("aria-label", "More options");
  menu.textContent = "⋯";
  menu.addEventListener("click", () => showToast("Clip menu (Move to folder) arrives with SV-44."));
  playerRow.append(playerName, menu);

  const title = document.createElement("p");
  title.className = "clip-title";
  title.textContent = clip.title;
  title.addEventListener("click", () => openDetails(clip));

  const date = document.createElement("p");
  date.className = "clip-date";
  date.textContent = "· " + formatDate(clip.date) + (clip.fileName ? " · " + clip.fileName : "");

  info.append(playerRow, title, date);

  // Footer
  const footer = document.createElement("div");
  footer.className = "clip-footer";

  const status = document.createElement("span");
  const statusClass = { "Approved": "status-approved", "Processing": "status-processing" }[clip.status] || "status-pending";
  status.className = "status " + statusClass;
  status.textContent = clip.status;

  const actions = document.createElement("div");
  actions.className = "clip-actions";

  const download = document.createElement("button");
  download.type = "button";
  download.className = "download-button";
  download.textContent = "Download";
  download.addEventListener("click", () => runDownload(clip, download, "Downloading…"));

  const del = document.createElement("button");
  del.type = "button";
  del.className = "delete-button";
  del.textContent = "Delete";
  del.addEventListener("click", () => openDeleteModal([clip.id]));

  actions.append(download, del);
  footer.append(status, actions);

  body.append(info, footer);
  card.append(thumb, body);
  return card;
}

function renderPagination(totalPages) {
  el.pagination.replaceChildren();
  if (totalPages <= 1) return;

  const make = (label, page, opts = {}) => {
    const b = document.createElement("button");
    b.type = "button";
    b.innerHTML = label;
    b.disabled = Boolean(opts.disabled);
    if (opts.active) b.classList.add("active");
    b.addEventListener("click", () => { state.page = page; render(); });
    return b;
  };

  el.pagination.appendChild(make("&#8249;", state.page - 1, { disabled: state.page === 1 }));
  for (let p = 1; p <= totalPages; p++) {
    el.pagination.appendChild(make(String(p), p, { active: p === state.page }));
  }
  el.pagination.appendChild(make("&#8250;", state.page + 1, { disabled: state.page === totalPages }));
}

function renderEmpty(visibleTotal) {
  const show = visibleTotal === 0;
  el.empty.hidden = !show;
  el.grid.hidden = show;
  if (!show) return;

  if (clips.length === 0) {
    el.emptyTitle.textContent = "No footage yet";
    el.emptyText.textContent = "Upload a game video and it will show up here.";
    el.emptyUpload.hidden = false;
    el.emptyClear.hidden = true;
  } else {
    el.emptyTitle.textContent = "No clips match";
    el.emptyText.textContent = "Try a different search or clear your filters.";
    el.emptyUpload.hidden = true;
    el.emptyClear.hidden = false;
  }
}

function render() {
  const visible = getVisibleClips();
  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  if (state.page > totalPages) state.page = totalPages;

  const start = (state.page - 1) * PAGE_SIZE;
  const pageClips = visible.slice(start, start + PAGE_SIZE);

  el.grid.replaceChildren(...pageClips.map(buildCard));
  el.grid.classList.toggle("list-view", state.view === "list");

  const total = visible.length;
  el.count.textContent = total + (total === 1 ? " clip" : " clips") +
    (filtersActive() && total !== clips.length ? " of " + clips.length : "");

  renderEmpty(total);
  renderPagination(totalPages);
  renderBulkButtons();
}

// ----- Selection -----
function toggleSelect(id) {
  if (state.selected.has(id)) state.selected.delete(id);
  else state.selected.add(id);
  render();
}

// ----- Clip details (SV-51 placeholder) -----
function openDetails(clip) {
  showToast("Clip Details (SV-51) isn’t built yet: " + clip.title);
}

// ----- Download simulation + banner (SV-62, SV-63) -----
function setBanner(strongText, message, isSuccess) {
  const strong = document.createElement("strong");
  strong.textContent = strongText;
  el.bannerText.replaceChildren(strong, document.createTextNode(" — " + message));
  el.banner.classList.toggle("success", isSuccess);
  el.retry.hidden = isSuccess;
  el.banner.hidden = false;
}

function showError(clip) {
  failedClip = clip;
  clearTimeout(bannerTimer);
  setBanner("Download failed",
    "“" + clip.title + "” couldn’t be downloaded. Check your connection and try again.", false);
}

function showSuccess(message) {
  failedClip = null;
  setBanner("Download complete", message, true);
  clearTimeout(bannerTimer);
  bannerTimer = setTimeout(() => { el.banner.hidden = true; }, 5000);
}

function simulateDownload(clip) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (clip.failsRemaining > 0) { clip.failsRemaining--; resolve(false); }
      else resolve(true);
    }, 1200);
  });
}

async function runDownload(clip, trigger, busyLabel) {
  const original = trigger.textContent;
  trigger.disabled = true;
  el.retry.disabled = true;
  trigger.textContent = busyLabel;

  const ok = await simulateDownload(clip);

  trigger.disabled = false;
  el.retry.disabled = false;
  trigger.textContent = original;

  if (ok) {
    showSuccess("“" + clip.title + "” was saved to your device.");
    const btn = document.querySelector('[data-clip-id="' + clip.id + '"] .download-button');
    if (btn) { btn.textContent = "Downloaded ✓"; btn.classList.add("done"); }
    showToast("Downloaded: " + clip.title);
  } else {
    showError(clip);
  }
}

async function exportSelected() {
  const chosen = clips.filter((c) => state.selected.has(c.id));
  if (chosen.length === 0) return;
  el.exportBtn.disabled = true;
  el.exportBtn.textContent = "Exporting…";
  await new Promise((r) => setTimeout(r, 1200));
  showSuccess(chosen.length + " clip" + (chosen.length === 1 ? "" : "s") + " exported to your device.");
  showToast("Exported " + chosen.length + " clip" + (chosen.length === 1 ? "" : "s"));
  state.selected.clear();
  render();
}

// ----- Delete confirmation (SV-57, SV-58, SV-59, SV-60) -----
function openDeleteModal(ids) {
  state.pendingDelete = ids;
  const chosen = clips.filter((c) => ids.includes(c.id));
  if (chosen.length === 1) {
    el.modalTitle.textContent = "Delete clip?";
    el.modalText.textContent =
      "“" + chosen[0].title + "” will be permanently removed from the library. This can’t be undone.";
  } else {
    el.modalTitle.textContent = "Delete " + chosen.length + " clips?";
    el.modalText.textContent =
      chosen.map((c) => "“" + c.title + "”").join(", ") +
      " will be permanently removed from the library. This can’t be undone.";
  }
  el.modal.hidden = false;
  el.modalConfirm.focus();
}

function closeDeleteModal() {
  el.modal.hidden = true;
  state.pendingDelete = [];
}

function confirmDelete() {
  const ids = state.pendingDelete;
  const removed = clips.filter((c) => ids.includes(c.id));
  clips = clips.filter((c) => !ids.includes(c.id));
  ids.forEach((id) => state.selected.delete(id));

  // Remember deletions so they survive a refresh (SV-56 persistence)
  const hiddenIds = removed.flatMap((c) => c.allIds || [c.id]);
  saveDeletedIds(getDeletedIds().concat(hiddenIds));
  recalcStorage();

  // If the failed-download banner refers to a deleted clip, clear it
  if (failedClip && ids.includes(failedClip.id)) {
    failedClip = null;
    el.banner.hidden = true;
  }

  closeDeleteModal();
  renderFilterOptions();
  renderStorage();
  render();
  showToast(removed.length === 1
    ? "Deleted: " + removed[0].title
    : "Deleted " + removed.length + " clips");
}

// ----- Events -----
el.search.addEventListener("input", () => { state.search = el.search.value; state.page = 1; render(); });
el.filterGame.addEventListener("change", () => { state.game = el.filterGame.value; state.page = 1; render(); });
el.filterPlayer.addEventListener("change", () => { state.player = el.filterPlayer.value; state.page = 1; render(); });
el.filterStatus.addEventListener("change", () => { state.status = el.filterStatus.value; state.page = 1; render(); });
el.sort.addEventListener("change", () => { state.sort = el.sort.value; render(); });

el.viewGrid.addEventListener("click", () => setView("grid"));
el.viewList.addEventListener("click", () => setView("list"));
function setView(view) {
  state.view = view;
  el.viewGrid.classList.toggle("active", view === "grid");
  el.viewList.classList.toggle("active", view === "list");
  render();
}

el.exportBtn.addEventListener("click", exportSelected);
el.bulkDeleteBtn.addEventListener("click", () => openDeleteModal([...state.selected]));

el.emptyClear.addEventListener("click", () => {
  state.search = ""; state.game = ""; state.player = ""; state.status = ""; state.page = 1;
  el.search.value = ""; el.filterGame.value = ""; el.filterPlayer.value = ""; el.filterStatus.value = "";
  render();
});

el.retry.addEventListener("click", () => {
  if (failedClip) runDownload(failedClip, el.retry, "Retrying…");
});
el.dismiss.addEventListener("click", () => { el.banner.hidden = true; clearTimeout(bannerTimer); });

el.modalCancel.addEventListener("click", closeDeleteModal);
el.modalConfirm.addEventListener("click", confirmDelete);
el.modal.addEventListener("click", (e) => { if (e.target === el.modal) closeDeleteModal(); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !el.modal.hidden) closeDeleteModal();
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); el.search.focus(); }
});

// ----- Start -----
// If an upload happens in another tab, refresh the library automatically.
window.addEventListener("storage", (e) => {
  if (e.key !== UPLOADS_KEY && e.key !== DELETED_KEY) return;
  clips = loadClips();
  const ids = new Set(clips.map((c) => c.id));
  state.selected.forEach((id) => { if (!ids.has(id)) state.selected.delete(id); });
  recalcStorage();
  renderFilterOptions();
  renderStorage();
  render();
});

renderFilterOptions();
renderStorage();
render();