import { db, auth } from "./firebase-config.js";
import { ref, get, update } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Get user ID from URL
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("uid");

if (!userId) {
    // If no user ID is found, redirect to users list
    window.location.href = "users.html";
}

// UI Elements
const displayNameEl = document.getElementById("display-name");
const emailEl = document.getElementById("email");
const bioEl = document.getElementById("bio");
const interestsEl = document.getElementById("interests");
const editSection = document.getElementById("edit-section");
const editProfileBtn = document.getElementById("edit-profile-btn");
const editProfileForm = document.getElementById("edit-profile-form");
const editForm = document.getElementById("edit-form");

const newDisplayName = document.getElementById("new-display-name");
const newBio = document.getElementById("new-bio");
const newInterests = document.getElementById("new-interests");

// Fetch user profile data
function loadUserProfile(uid) {
    const userRef = ref(db, `users/${uid}`);
    get(userRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                displayNameEl.textContent = userData.displayName || "No Name";
                emailEl.textContent = userData.email || "No Email";
                bioEl.textContent = userData.bio || "No Bio";
                interestsEl.textContent = userData.interests || "No Interests";
            } else {
                console.log("No user data found.");
            }
        })
        .catch((error) => console.error("Error fetching user data:", error));
}

// Check authentication and allow editing only for the logged-in user
onAuthStateChanged(auth, (user) => {
    if (user) {
        if (user.uid === userId) {
            editSection.style.display = "block"; // Show edit button if viewing own profile
        }
    }
    loadUserProfile(userId);
});

// Show edit form
editProfileBtn?.addEventListener("click", () => {
    editProfileForm.style.display = "block";
    newDisplayName.value = displayNameEl.textContent;
    newBio.value = bioEl.textContent;
    newInterests.value = interestsEl.textContent;
});

// Handle profile updates
editForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || user.uid !== userId) return; // Prevent unauthorized edits

    const updatedData = {
        displayName: newDisplayName.value.trim(),
        bio: newBio.value.trim(),
        interests: newInterests.value.trim(),
    };

    update(ref(db, `users/${user.uid}`), updatedData)
        .then(() => {
            alert("Profile updated successfully!");
            window.location.reload(); // Refresh page to see updated data
        })
        .catch((error) => console.error("Error updating profile:", error));
});
