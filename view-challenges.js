import { db, auth } from "./firebase-config.js";
import { ref, get, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const challengeList = document.getElementById("challengeList");

// Load challenges assigned to logged-in user
async function loadChallenges(userId) {
    const challengesRef = ref(db, "challenges/");
    
    try {
        const snapshot = await get(challengesRef);
        challengeList.innerHTML = ""; // Clear previous content

        if (snapshot.exists()) {
            snapshot.forEach(challenge => {
                const challengeData = challenge.val();
                if (challengeData.assignedUser === userId) {
                    const li = document.createElement("li");
                    li.innerHTML = `
                        <strong>${challengeData.challengeTitle}</strong><br>
                        <em>${challengeData.creatorName}</em><br>
                        ${challengeData.challengeDescription}<br>
                        <button onclick="submitResponse('${challenge.key}')">Submit Response</button>
                    `;
                    challengeList.appendChild(li);
                }
            });

            if (challengeList.children.length === 0) {
                challengeList.innerHTML = "<li>No challenges assigned to you.</li>";
            }
        } else {
            challengeList.innerHTML = "<li>No challenges found.</li>";
        }
    } catch (error) {
        console.error("Error loading challenges:", error);
        challengeList.innerHTML = "<li>Error loading challenges.</li>";
    }
}

// Submit a response
window.submitResponse = async (challengeId) => {
    const responseText = prompt("Enter your response:");
    if (!responseText) return;

    try {
        const challengeRef = ref(db, `challenges/${challengeId}`);
        await update(challengeRef, { submitted: true, response: responseText });
        alert("Response submitted successfully!");
        loadChallenges(auth.currentUser.uid);
    } catch (error) {
        console.error("Error submitting response:", error);
        alert("Error submitting response.");
    }
};

// Authenticate and load challenges
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadChallenges(user.uid);
    } else {
        challengeList.innerHTML = "<li>You must be logged in to view challenges.</li>";
    }
});
