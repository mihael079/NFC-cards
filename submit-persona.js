import { db } from "./firebase-config.js";
import {
  ref,
  get,
  push,
  child
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Elements
const userSelect = document.getElementById("userSelect");
const form = document.getElementById("personaForm");
const statusMsg = document.getElementById("statusMsg");

// 1. Populate User Dropdown from /users
async function loadUsers() {
  const usersRef = ref(db, "users");
  const snapshot = await get(usersRef);

  userSelect.innerHTML = ""; // clear default

  if (snapshot.exists()) {
    const users = snapshot.val();
    Object.entries(users).forEach(([uid, data]) => {
      const option = document.createElement("option");
      option.value = uid;
      option.textContent = data.displayName || `Unnamed (${uid})`;
      userSelect.appendChild(option);
    });
  } else {
    userSelect.innerHTML = `<option value="">No users found</option>`;
  }
}

loadUsers();

// 2. Submit persona card
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const uid = userSelect.value;
  if (!uid) {
    statusMsg.textContent = "❌ Please select a user.";
    return;
  }

  const personaData = {
    name: document.getElementById("name").value.trim(),
    challenge: document.getElementById("challenge").value.trim(),
    program: document.getElementById("program").value.trim(),
    positives: document.getElementById("positives").value.trim(),
    negatives: document.getElementById("negatives").value.trim(),
    quote: document.getElementById("quote").value.trim(),
    timestamp: new Date().toISOString()
  };

  try {
    const personaRef = child(ref(db), `personaSubmissions/${uid}`);
    await push(personaRef, personaData);
    statusMsg.textContent = "✅ Persona Card submitted successfully!";
    form.reset();
  } catch (err) {
    console.error("Error submitting card:", err);
    statusMsg.textContent = "❌ Error submitting card.";
  }
});
