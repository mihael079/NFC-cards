import { db, auth } from "./firebase-config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Get user ID from URL
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("uid");
if (!userId) {
  window.location.href = "users.html";
}

// Elements
const displayNameEl = document.getElementById("display-name");
const emailEl = document.getElementById("email");
const bioEl = document.getElementById("bio");
const interestsEl = document.getElementById("interests");
const profilePhotoEl = document.getElementById("profile-photo");
const editSection = document.getElementById("edit-section");
const editProfileBtn = document.getElementById("edit-profile-btn");

// Load user profile data
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
        profilePhotoEl.src = userData.profilePic || "avatar1.jpg";
      } else {
        console.log("No user data found.");
      }
    })
    .catch((error) => console.error("Error fetching user data:", error));
}

// Handle auth + load + enable edit if self
onAuthStateChanged(auth, (user) => {
  if (user) {
    if (user.uid === userId) {
      editSection.style.display = "block";
    }
  }
  loadUserProfile(userId);
});

// Redirect to profile editor
editProfileBtn?.addEventListener("click", () => {
  window.location.href = "profile.html";
});
