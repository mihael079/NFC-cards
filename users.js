import { db } from "./firebase-config.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const usersList = document.getElementById("users-list");

function fetchUsers() {
    const usersRef = ref(db, "users/");
    onValue(usersRef, (snapshot) => {
        usersList.innerHTML = ""; // Clear previous data
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const userData = childSnapshot.val();
                const userCard = document.createElement("div");
                userCard.classList.add("user-card");
                userCard.innerHTML = `
                    <h3>${userData.displayName || "No Name"}</h3>
                    <p>${userData.email}</p>
                    <a href="user-profile.html?uid=${childSnapshot.key}">View Profile</a>
                `;
                usersList.appendChild(userCard);
            });
        } else {
            usersList.innerHTML = "<p>No users found</p>";
        }
    });
}

fetchUsers(); // Call the function to load users immediately
