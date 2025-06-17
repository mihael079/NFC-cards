import { db, auth } from "./firebase-config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Get UID from URL
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("uid");

if (!userId) {
  window.location.href = "users.html";
}

// DOM elements
const displayNameEl = document.getElementById("display-name");
const talentsEl = document.getElementById("talents");
const bioEl = document.getElementById("bio");
const interestsEl = document.getElementById("interests");
const profilePhotoEl = document.getElementById("profile-photo");
const editSection = document.getElementById("edit-section");
const editProfileBtn = document.getElementById("edit-profile-btn");
const personaBtnLink = document.getElementById("persona-button-link");

// Set persona card link dynamically
if (personaBtnLink && userId) {
  personaBtnLink.href = `persona-cards.html?uid=${userId}`;
}

const answerBtn = document.getElementById("answerBtn");

if (answerBtn && userId) {
  answerBtn.onclick = () => location.href = `answer-me.html?uid=${userId}`;
}


// Load profile data
function loadUserProfile(uid) {
  const userRef = ref(db, `users/${uid}`);
  get(userRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        displayNameEl.textContent = userData.displayName || "No Name";
        talentsEl.textContent = userData.talents ?? 0;
        bioEl.textContent = userData.bio || "No Bio";
        interestsEl.textContent = userData.interests || "No Interests";
        profilePhotoEl.src = userData.profilePic || "avatar1.jpg";
      } else {
        console.log("No user data found.");
      }
    })
    .catch((error) => console.error("Error fetching user data:", error));
}

// Handle auth and show edit button if it's the owner
onAuthStateChanged(auth, (user) => {
  if (user && user.uid === userId) {
    editSection.style.display = "block";
  }
  loadUserProfile(userId);
});

// Redirect to profile.html on edit
editProfileBtn?.addEventListener("click", () => {
  window.location.href = "profile.html";
});
