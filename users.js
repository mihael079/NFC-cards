import { db } from "./firebase-config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const usersList = document.getElementById("usersList");

async function loadUsers() {
    const snapshot = await get(ref(db, "users/"));
    if (snapshot.exists()) {
        usersList.innerHTML = ""; // Clear previous content
        snapshot.forEach(childSnapshot => {
            const user = childSnapshot.val();
            const userId = childSnapshot.key;

            const userCard = document.createElement("div");
            userCard.className = "user-card";
            userCard.innerHTML = `
                <img src="${user.profilePic || 'default-avatar.png'}" width="100">
                <h3>${user.displayName || "Unnamed User"}</h3>
                <button onclick="viewProfile('${userId}')">View Profile</button>
            `;
            usersList.appendChild(userCard);
        });
    } else {
        usersList.innerHTML = "<p>No users found.</p>";
    }
}

// Ensure viewProfile is globally accessible
window.viewProfile = (userId) => {
    window.location.href = `user-profile.html?uid=${userId}`;
};

loadUsers();
