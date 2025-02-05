import { db, auth } from "./firebase-config.js";
import { ref, get, push, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const assignedUserSelect = document.getElementById("assignedUser");
const challengeForm = document.getElementById("challengeForm");

// Load users into dropdown
async function loadUsers() {
    const usersRef = ref(db, "users/");
    
    try {
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
            assignedUserSelect.innerHTML = ""; // Clear old data
            
            snapshot.forEach(user => {
                const userData = user.val();
                const option = document.createElement("option");
                option.value = user.key; // User ID
                option.textContent = userData.displayName || "Unnamed User";
                assignedUserSelect.appendChild(option);
            });

            if (assignedUserSelect.options.length === 0) {
                assignedUserSelect.innerHTML = "<option disabled>No users found</option>";
            }
        } else {
            assignedUserSelect.innerHTML = "<option disabled>No users available</option>";
        }
    } catch (error) {
        console.error("Error loading users:", error);
        assignedUserSelect.innerHTML = "<option disabled>Error fetching users</option>";
    }
}

// Handle challenge submission
challengeForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const creatorName = document.getElementById("creatorName").value.trim();
    const challengeTitle = document.getElementById("challengeTitle").value.trim();
    const challengeDescription = document.getElementById("challengeDescription").value.trim();
    const assignedUser = assignedUserSelect.value; // Selected user ID

    if (!creatorName || !challengeTitle || !challengeDescription || !assignedUser) {
        alert("Please fill in all fields.");
        return;
    }

    // Store challenge
    try {
        const challengesRef = ref(db, "challenges/");
        const newChallengeRef = push(challengesRef); // Generate unique challenge ID

        await set(newChallengeRef, {
            creatorName,
            challengeTitle,
            challengeDescription,
            assignedUser, // Store assigned user's ID
            submitted: false, // Track if challenge is completed
            response: "" // Empty response initially
        });

        alert("Challenge created successfully!");
        challengeForm.reset();
    } catch (error) {
        console.error("Error creating challenge:", error);
        alert("Error creating challenge. Please try again.");
    }
});

// Load users when page loads
document.addEventListener("DOMContentLoaded", loadUsers);
