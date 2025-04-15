// submit-talent.js
import { db } from "./firebase-config.js";
import { ref, get, update } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const userSelect = document.getElementById("userSelect");
const typeSelect = document.getElementById("typeSelect");
const talentValue = document.getElementById("talentValue");
const submitTalent = document.getElementById("submitTalent");
const status = document.getElementById("status");

// Load users for dropdown
async function loadUsers() {
  const usersRef = ref(db, "users");
  const snapshot = await get(usersRef);

  if (snapshot.exists()) {
    const users = snapshot.val();
    for (const uid in users) {
      const option = document.createElement("option");
      option.value = uid;
      option.textContent = users[uid].displayName || uid;
      userSelect.appendChild(option);
    }
  } else {
    status.textContent = "No users found.";
  }
}

loadUsers();

// Handle talent submission
submitTalent.addEventListener("click", async () => {
  const uid = userSelect.value;
  const isPlus = typeSelect.value === "plus";
  const amount = parseInt(talentValue.value);

  if (!uid || isNaN(amount)) {
    status.textContent = "Please fill in all fields correctly.";
    return;
  }

  const userRef = ref(db, `users/${uid}`);
  const snapshot = await get(userRef);

  if (snapshot.exists()) {
    const userData = snapshot.val();
    const currentTalent = parseInt(userData.talents) || 0;
    const newTalent = isPlus ? currentTalent + amount : currentTalent - amount;

    await update(userRef, { talents: newTalent });
    status.textContent = `✅ Success! New talent value: ${newTalent}`;
    talentValue.value = "";
  } else {
    status.textContent = "User not found.";
  }
});
