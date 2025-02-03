import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const db = getDatabase();
const assignedUserSelect = document.getElementById("assignedUser");

// Load users into dropdown
async function loadUsers() {
    const usersRef = ref(db, "users/");
    
    try {
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
            assignedUserSelect.innerHTML = ""; // Clear old data
            
            snapshot.forEach(user => {
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

// Load users when page loads
document.addEventListener("DOMContentLoaded", loadUsers);
