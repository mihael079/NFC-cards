import { db } from "./firebase-config.js"; // Ensure Firebase config is imported
import { ref, get, push, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const assignedUserSelect = document.getElementById("assignedUser");
const questionForm = document.getElementById("questionForm");

// Load users into dropdown
async function loadUsers() {
    const usersRef = ref(db, "users/");

    try {
        const snapshot = await get(usersRef);
        assignedUserSelect.innerHTML = ""; // Clear dropdown before adding users

        if (snapshot.exists()) {
            snapshot.forEach((user) => {
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

// Submit question
questionForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const askerName = document.getElementById("askerName").value.trim();
    const questionText = document.getElementById("questionText").value.trim();
    const assignedUser = assignedUserSelect.value;

    if (!askerName || !questionText || !assignedUser) {
        alert("Please fill in all fields.");
        return;
    }

    const questionRef = push(ref(db, "questions"));
    
    await set(questionRef, {
        askerName,
        questionText,
        assignedUser,
        answer: null, // Not answered yet
        timestamp: Date.now()
    });

    alert("Question submitted!");
    questionForm.reset();
});

// Ensure Firebase is initialized before loading users
document.addEventListener("DOMContentLoaded", loadUsers);
