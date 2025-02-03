import { db } from "./firebase-config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Get UID from URL
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("uid");

const userName = document.getElementById("userName");
const userProfilePic = document.getElementById("userProfilePic");
const userBio = document.getElementById("userBio");

if (userId) {
    loadUserProfile(userId);
} else {
    userName.innerText = "User Not Found";
}

// Fetch user data from Firebase
async function loadUserProfile(uid) {
    const snapshot = await get(ref(db, `users/${uid}`));
    if (snapshot.exists()) {
        const user = snapshot.val();
        userName.innerText = user.displayName || "Unnamed User";
        userProfilePic.src = user.profilePic || "default-avatar.png";
        userBio.innerText = user.bio || "No bio available.";
    } else {
        userName.innerText = "User Not Found";
        userBio.innerText = "";
    }
}

// Go back button
window.goBack = () => {
    window.location.href = "users.html";
};
