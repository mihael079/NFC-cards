import { db } from "./firebase-config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const usersList = document.getElementById("users-list");

function loadUsers() {
    const usersRef = ref(db, "users");

    get(usersRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                usersList.innerHTML = ""; // Clear previous content
                const users = snapshot.val();
                
                Object.keys(users).forEach((uid) => {
                    const user = users[uid];

                    // Create user card
                    const userCard = document.createElement("div");
                    userCard.classList.add("user-card");
                    userCard.innerHTML = `
                        <h3>${user.displayName || "No Name"}</h3>
                        <p>${user.bio || "No Bio"}</p>
                        <a href="user-profile.html?uid=${uid}" class="view-profile-btn">View Profile</a>
                    `;

                    usersList.appendChild(userCard);
                });
            } else {
                usersList.innerHTML = "<p>No users found.</p>";
            }
        })
        .catch((error) => console.error("Error fetching users:", error));
}

loadUsers();
