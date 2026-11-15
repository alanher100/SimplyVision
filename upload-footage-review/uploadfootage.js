//MOSTLY FOR DEMO
//SAVES METADATA ONLY IN localStorage
//NO ACTUAL VIDEO UPLOADED AS OF THIS SPRINT
//NEEDS BACKEND API STUFF

const fileInput = document.getElementById("videoFile");
const fileInfo = document.getElementById("selectedFileInfo");
const fileName = document.getElementById("selectedFileName");
const fileError = document.getElementById("fileError");
const dropZone = document.getElementById("fileDropZone");
const removeButton = document.getElementById("removeFileButton");
const notes = document.getElementById("additionalNotes");
const notesCount = document.getElementById("notesCount");
const gameInformationSection = document.getElementById("gameInformationSection");
const uploadForm = document.getElementById("uploadForm");
const uploadSection = document.getElementById("uploadSection");
const uploadSuccess = document.getElementById("uploadSuccess");
const uploadAnotherButton = document.getElementById("uploadAnotherButton");
const successDetails = document.getElementById("successDetails");

const STORAGE_KEY = "simplyvisionVideos"; //storing video record in browser's localStorage
const MAX_FILE_SIZE = 4 * 1024 * 1024 * 1024; // 4 GB (demo limit)
let selectedFile = null; //tracks selected file, nothing is selected at first

//file errors section
function showFileError(message) {
    fileError.textContent = message;
    fileError.hidden = false;
}

function clearFileError() {
    fileError.textContent = "";
    fileError.hidden = true;
}

//clearing selected video, resets details with prior selected video
//does not clear the game info fields on its own
function clearSelectedFile() {
    selectedFile = null; //removes reference
    fileInput.value = "";
    fileName.textContent = "";
    fileInfo.hidden = true;
    clearFileError(); //removes the error
}

//video selection and validation
function selectVideo(file) {
    // start with clearing previous selection
    clearSelectedFile();
    if (!file) return; //exits function if no file is given

    const extension = file.name.split(".").pop().toLowerCase();
      //example:
        //"game_1.MP4" file given
        //.split (".") -- "game_1" "MP4"
        //.pop() -- "MP4"
        //.toLowerCase() -- "mp4"
    
    //format check
    //this does not prove the file is valid tho, just that the extension matches
    //this is good for frontend demo at the moment
    if (!["mp4", "mov"].includes(extension)) {
        showFileError("Select an MP4 or MOV video file.");
        return;
      
    }

    //file size check
    if (file.size > MAX_FILE_SIZE) {
        showFileError("Video file size must be 4 GB or smaller.");
        return;
    }

    //reject empty file
    if (file.size === 0) {
        showFileError("Selected file is empty.");
        return;
    }

    //this part for storing file ref, size, and displaying both
    selectedFile = file;
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    fileName.textContent = `${file.name} (${sizeMB} MB)`;
    fileInfo.hidden = false;
}

//choose a file via the OS file finder
fileInput.addEventListener("change", () => {
    selectVideo(fileInput.files[0]);
});

// drag-and-drop handler: prevents browser from opening the video
["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
    dropZone.addEventListener(eventName, event => {
        event.preventDefault(); //prevents browser from opening the file, which is default
        event.stopPropagation();//prevents parent elements from being affected
    });
});

//adds .drag_over from CSS so that box highlights when file is hovered over it
dropZone.addEventListener("dragenter", () => {
    dropZone.classList.add("drag_over");
});
dropZone.addEventListener("dragover", () => {
    dropZone.classList.add("drag_over");
});

//removes .drag_over form CSS so box isn't highlighted anymore when not hovering
dropZone.addEventListener("dragleave", event => {
    if (!dropZone.contains(event.relatedTarget)) {
        dropZone.classList.remove("drag_over");
    }
});

//dropped file handler
dropZone.addEventListener("drop", event => {
    dropZone.classList.remove("drag_over");
    const files = event.dataTransfer.files; //dataTransfer has info about dragged items
    if (files.length !== 1) { //checks only 1 file was dropped in
        clearSelectedFile();
        showFileError("Please drop exactly one video file at a time.");
        return;
    }
    selectVideo(files[0]);
});

//remove button handler
removeButton.addEventListener("click", clearSelectedFile);

//for character counter to actually count the characters
notes.addEventListener("input", () => {
    notesCount.textContent = notes.value.length;
});

//form reset handler
uploadForm.addEventListener("reset", () => {
    clearSelectedFile();
    notesCount.textContent = "0";
});

//DEMO SIMULATION SECTION
uploadForm.addEventListener("submit", event => {
    event.preventDefault(); //so browser doesn't reload page
    clearFileError();

    if (!selectedFile) { //checking that video was selected
        showFileError("Please choose or drop a video before uploading.");
        dropZone.scrollIntoView({ behavior: "smooth", block: "center" }); //to see the error
        return;
    }
    if (!uploadForm.reportValidity()) return; //if form is invalid, js stops the submission

    //creating a js object
    const videoDetails = {
        //creating id for each saved video record
        id: (typeof crypto !== "undefined" && crypto.randomUUID)
            ? crypto.randomUUID() //generates UUID
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`, //or uses current timestamp and random string, for when objects have same name
        gameID: document.getElementById("gameID").value.trim(), //.trim removes white space
        gameDate: document.getElementById("gameDate").value,
        sport: document.getElementById("sport").value,
        homeTeam: document.getElementById("homeTeam").value.trim(),
        awayTeam: document.getElementById("awayTeam").value.trim(),
        gameLevel: document.getElementById("gameLevel").value,
        gender: document.getElementById("gender").value,
        additionalNotes: notes.value.trim(),
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileType: selectedFile.type,
        status: "Uploaded (Demo)",
        uploadedAt: new Date().toISOString() //date in ISO 8601 format ex: 2026-11-15T16:30:00.000Z
    };

    //this part actually saves info in simulated upload
    //localStorage browser feature that allows sites to save small amount of data
    //persists when refreshed or closed
    //not a server, still needs backend stuff later
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); //JSON empty array as default
        if (!Array.isArray(saved)) throw new Error("Saved video records are invalid"); //verification
        saved.push(videoDetails); //adds the new record
        localStorage.setItem(
            STORAGE_KEY, 
            JSON.stringify(saved) //converts back to JSON
        );
    } catch (error) {
        console.error("Unable to save video metadata:", error);
        showFileError("Could not save video details in this browser. Check browser storage settings.");
        return;
    }

    //after metadata is saved
    //when user clicks Upload Another Video:
    //resets game info form and selected file
    //hides upload confirmation screen
    //displays file selection section again
    //displays game info section again
    //scrolls back to top
    successDetails.textContent = `Details for ${videoDetails.fileName} were saved in this browser.`;
    uploadSection.hidden = true;
    gameInformationSection.hidden = true;
    uploadSuccess.hidden = false;
    uploadSuccess.scrollIntoView({ behavior: "smooth", block: "start" }); //scrolls to confirmation
});