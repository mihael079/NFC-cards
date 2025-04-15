import { db } from "./firebase-config.js";
import { ref, set, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const form = document.getElementById("personaForm");
const userSelect = document.getElementById("userSelect");

let uidMap = {};

// 🔄 Load usernames into dropdown
async function loadUsers() {
  try {
    const snapshot = await get(ref(db, "users"));
    if (snapshot.exists()) {
      const users = snapshot.val();

      Object.keys(users).forEach(uid => {
        const displayName = users[uid].displayName || uid;
        uidMap[displayName] = uid;

        const option = document.createElement("option");
        option.value = displayName;
        option.textContent = displayName;
        userSelect.appendChild(option);
      });
    } else {
      alert("No users found in database.");
    }
  } catch (err) {
    console.error("Error loading users:", err);
    alert("Failed to load users.");
  }
}

// 📨 Handle form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const selectedName = userSelect.value;
  const uid = uidMap[selectedName];

  if (!uid) {
    alert("Please select a valid user.");
    return;
  }

  const personaData = {
    name: document.getElementById("name").value.trim(),
    challenge: document.getElementById("challenge").value.trim(),
    program: document.getElementById("program").value.trim(),
    positives: document.getElementById("positives").value.trim(),
    negatives: document.getElementById("negatives").value.trim(),
    quote: document.getElementById("quote").value.trim(),
    submittedAt: new Date().toISOString()
  };

  try {
    await set(ref(db, `personaSubmissions/${uid}`), personaData);
    alert("Persona Card submitted successfully!");
    form.reset();
  } catch (error) {
    console.error("Error saving persona:", error);
    alert("Failed to submit persona card.");
  }
});

// 🔃 Load usernames when page loads
loadUsers();
