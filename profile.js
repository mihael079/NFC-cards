import { auth, db } from "./firebase-config.js";
import { ref, get, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const profileImage = document.getElementById("profileImage");
const profilePicInput = document.getElementById("profilePic");
const displayNameInput = document.getElementById("displayName");
const bioInput = document.getElementById("bio");
const statusMsg = document.getElementById("status");
const logoutBtn = document.getElementById("logoutBtn");

let userId;

// Redirect if not logged in
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    userId = user.uid;
    loadProfile();
});

// Load profile data
async function loadProfile() {
    const snapshot = await get(ref(db, `users/${userId}`));
    if (snapshot.exists()) {
        const data = snapshot.val();
        profileImage.src = data.profilePic || "default-avatar.png";
        displayNameInput.value = data.displayName || "";
        bioInput.value = data.bio || "";
    }
}

// Save profile data
window.saveProfile = async () => {
    const userData = {
        displayName: displayNameInput.value,
        bio: bioInput.value,
    };

    await set(ref(db, `users/${userId}`), userData);
    statusMsg.innerText = "Profile updated!";
};

// Logout
logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
});
