import { db } from "./firebase-config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Get UID from URL
const urlParams = new URLSearchParams(window.location.search);
const uid = urlParams.get("uid");

// DOM element
const container = document.getElementById("personaContainer");

// If UID is missing
if (!uid) {
  container.innerHTML = `
    <div class="persona-card" style="border: 2px solid #ff5252; padding: 20px; color: #d32f2f;">
      ❌ Error: No UID provided in the URL.
    </div>
  `;
} else {
  const personaRef = ref(db, `personaSubmissions/${uid}`);

  get(personaRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const personaData = snapshot.val();
        const cards = Object.values(personaData);

        if (cards.length === 0) {
          container.innerHTML = `<div class="persona-card" style="color:#444;">No persona cards assigned yet.</div>`;
          return;
        }

        container.innerHTML = ""; // Clear loading

        cards.forEach((card, index) => {
          // 🔍 Debug output
          console.log(`Card ${index + 1}`, card);

          const html = `
            <div class="persona-card" style="margin-bottom: 20px; background: #fffbe6; border: 2px solid #ffb800; padding: 20px; border-radius: 10px;">
              <h2 style="color: #0277bd;">${card.name || "Untitled Persona Card"}</h2>
              <p><strong>Challenge:</strong> ${card.challenge || "N/A"}</p>
              <p><strong>Program:</strong> ${card.program || "N/A"}</p>
              <p><strong>+ Points:</strong><br>${card.positives || "None"}</p>
              <p><strong>- Points:</strong><br>${card.negatives || "None"}</p>
              <blockquote style="margin-top:10px; color: #4e342e;">"${card.quote || "No quote provided."}"</blockquote>
              <small style="color:#777;">📅 ${card.timestamp ? new Date(card.timestamp).toLocaleDateString() : "No date"}</small>
            </div>
          `;
          container.innerHTML += html;
        });
      } else {
        container.innerHTML = `
          <div class="persona-card" style="padding: 20px; color: #666;">No persona cards assigned to this user yet.</div>
        `;
      }
    })
    .catch((error) => {
      console.error("Error fetching persona cards:", error);
      container.innerHTML = `
        <div class="persona-card" style="color:red;">
          ❌ Error loading persona card.
        </div>
      `;
    });
}
