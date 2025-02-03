import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const db = getDatabase();
const storage = getStorage();
const auth = getAuth();
const challengesList = document.getElementById("challengesList");
const fileUploadSection = document.getElementById("fileUploadSection");
const selectedChallengeTitle = document.getElementById("selectedChallengeTitle");
const responseFile = document.getElementById("responseFile");
let selectedChallengeId = null;

// Load user-specific challenges
auth.onAuthStateChanged((user) => {
    if (user) {
        const userId = user.uid;
        const challengesRef = ref(db, "challenges/");

        get(challengesRef).then(snapshot => {
            if (snapshot.exists()) {
                challengesList.innerHTML = "";
                snapshot.forEach(challenge => {
                    const data = challenge.val();
                    if (data.assignedTo === userId) {
                        const li = document.createElement("li");
                        li.textContent = `${data.title} - ${data.description}`;
                        li.addEventListener("click", () => showUploadSection(challenge.key, data.title));
                        challengesList.appendChild(li);
                    }
                });
            } else {
                challengesList.innerHTML = "<p>No challenges assigned to you.</p>";
            }
        }).catch(error => console.error("Error loading challenges:", error));
    } else {
        challengesList.innerHTML = "<p>Please log in to view challenges.</p>";
    }
});

// Show file upload section
function showUploadSection(challengeId, title) {
    selectedChallengeId = challengeId;
    selectedChallengeTitle.textContent = title;
    fileUploadSection.style.display = "block";
}

// Submit response file
function submitResponse() {
    const file = responseFile.files[0];
    if (!file || !selectedChallengeId) {
        alert("Please select a file and challenge.");
        return;
    }

    const fileRef = storageRef(storage, `responses/${selectedChallengeId}/${file.name}`);
    uploadBytes(fileRef, file).then(() => {
        return getDownloadURL(fileRef);
    }).then((downloadURL) => {
        const challengeResponseRef = ref(db, `challenges/${selectedChallengeId}`);
        update(challengeResponseRef, { response: { fileUrl: downloadURL, submittedAt: new Date().toISOString() } })
            .then(() => {
                alert("Response submitted successfully!");
                fileUploadSection.style.display = "none";
            })
            .catch(error => console.error("Error saving response:", error));
    }).catch(error => console.error("Error uploading file:", error));
}
