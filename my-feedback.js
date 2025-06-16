import { db, auth } from "./firebase-config.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { ref, get } from
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const list = document.getElementById("list");

onAuthStateChanged(auth, async user => {
  if (!user) {
    list.innerHTML = "<p>You must be logged in to view feedback.</p>";
    return;
  }

  try {
    const snap = await get(ref(db, `users/${user.uid}/feedback`));
    if (!snap.exists()) {
      list.innerHTML = "<p>No feedback yet.</p>";
      return;
    }

    list.innerHTML = ""; // clear “Loading…”
    // feedback nodes are stored by auto-key
    const entries = Object.values(snap.val()).reverse(); // newest first

    entries.forEach(fb => {
      const card = document.createElement("div");
      card.className = "fb-card";
      card.innerHTML = `
        <h3>Card #${fb.card ?? "?"}</h3>
        <small>${new Date(fb.submittedAt).toLocaleString()}</small>
        <p><strong>Impression:</strong><br>${fb.impression}</p>
        <p><strong>Intensity:</strong> ${fb.intensity}</p>
        <p><strong>Performance:</strong><br>${fb.performance}</p>
      `;
      list.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    list.innerHTML = "<p>Error loading feedback.</p>";
  }
});
