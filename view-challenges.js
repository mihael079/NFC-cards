import { db, auth } from "./firebase-config.js";
import { ref, get, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const challengeList = document.getElementById("challengeList");

async function loadChallenges(userId) {
    const challengesRef = ref(db, "challenges/");
    
    try {
        const snapshot = await get(challengesRef);
        challengeList.innerHTML = ""; // Clear previous content

        if (snapshot.exists()) {
            snapshot.forEach(challenge => {
                const challengeData = challenge.val();
                const progressPercent = challengeData.submitted ? 100 : 0;

                if (challengeData.assignedUser === userId) {
                    const card = document.createElement("div");
                    card.className = "challenge-card";
                    
                    card.innerHTML = `
                        <div class="card-header">
                            <i class="fa-solid fa-flag-checkered"></i>
                            <h3>${challengeData.challengeTitle}</h3>
                        </div>
                        <div class="card-body">
                            <p><strong>Creator:</strong> ${challengeData.creatorName}</p>
                            <p><strong>Description:</strong> ${challengeData.challengeDescription}</p>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progressPercent}%;">
                                    ${progressPercent}%
                                </div>
                            </div>
                            <p><strong>Status:</strong> ${challengeData.submitted ? "✅ Submitted" : "⏳ Not Submitted"}</p>
                            <p><strong>Your Response:</strong><br> ${challengeData.response ? challengeData.response : "<em>No response yet.</em>"}</p>
                        </div>
                        <div class="card-action">
                            <button onclick="submitResponse('${challenge.key}')">Submit / Update Response</button>
                        </div>
                    `;
                    
                    challengeList.appendChild(card);
                }
            });

            if (challengeList.children.length === 0) {
                challengeList.innerHTML = "<p>No challenges assigned to you.</p>";
            }
        } else {
            challengeList.innerHTML = "<p>No challenges found.</p>";
        }
    } catch (error) {
        console.error("Error loading challenges:", error);
        challengeList.innerHTML = "<p>Error loading challenges.</p>";
    }
}

window.submitResponse = async (challengeId) => {
    const responseText = prompt("Enter your response:");
    if (!responseText) return;

    try {
        const challengeRef = ref(db, `challenges/${challengeId}`);
        await update(challengeRef, { submitted: true, response: responseText });
        alert("Response submitted successfully!");
        loadChallenges(auth.currentUser.uid); // Refresh the card list
    } catch (error) {
        console.error("Error submitting response:", error);
        alert("Error submitting response.");
    }
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        loadChallenges(user.uid);
    } else {
        challengeList.innerHTML = "<p>You must be logged in to view challenges.</p>";
    }
});
