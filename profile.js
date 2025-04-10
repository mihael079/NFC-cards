import { auth, db } from "./firebase-config.js";
import { ref as dbRef, get, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// DOM Elements
const profileImage = document.getElementById("profileImage");
const avatarSelect = document.getElementById("avatarSelect");
const displayNameInput = document.getElementById("displayName");
const bioInput = document.getElementById("bio");
const interestsInput = document.getElementById("interests");
const statusMsg = document.getElementById("status");
const saveBtn = document.getElementById("saveBtn");
const logoutBtn = document.getElementById("logoutBtn");

let userId;

// 🔄 Update image preview when avatar selection changes
avatarSelect.addEventListener("change", () => {
  profileImage.src = avatarSelect.value;
});

// 🔐 Check auth and load profile
onAuthStateChanged(auth, (user) => {
  if (user) {
    userId = user.uid;
    loadProfile();
  } else {
    window.location.href = "login.html";
  }
});

// 📥 Load profile data from Firebase
async function loadProfile() {
  try {
    const snapshot = await get(dbRef(db, `users/${userId}`));
    if (snapshot.exists()) {
      const data = snapshot.val();
      const profilePic = data.profilePic || "avatar1.jpg";
      profileImage.src = profilePic;
      avatarSelect.value = profilePic;
      displayNameInput.value = data.displayName || "";
      bioInput.value = data.bio || "";
      interestsInput.value = data.interests || "";
    } else {
      profileImage.src = "avatar1.jpg";
      avatarSelect.value = "avatar1.jpg";
    }
  } catch (error) {
    console.error("Error loading profile:", error);
    statusMsg.textContent = "Failed to load profile.";
  }
}

// 💾 Save profile data to Firebase
saveBtn.addEventListener("click", async () => {
  const userData = {
    profilePic: avatarSelect.value,
    displayName: displayNameInput.value,
    bio: bioInput.value,
    interests: interestsInput.value
  };

  try {
    await set(dbRef(db, `users/${userId}`), userData);
    statusMsg.textContent = "Profile updated successfully!";
    profileImage.src = avatarSelect.value;
  } catch (error) {
    console.error("Error saving profile:", error);
    statusMsg.textContent = "Failed to save profile.";
  }
});

// 🚪 Logout handler
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});
