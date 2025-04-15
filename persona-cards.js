import { db } from "./firebase-config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const container = document.getElementById("personaContainer");

// ✅ Wrap everything in an IIFE so return statements work safely
(async function loadPersonaCards() {
  const urlParams = new URLSearchParams(window.location.search);
  const uid = urlParams.get("uid");

  if (!uid) {
    container.innerHTML = `<p class="no-cards">❌ Error: No UID provided in the URL.</p>`;
    return;
  }

  try {
    const cardRef = ref(db, `personaSubmissions/${uid}`);
    const snapshot = await get(cardRef);
    container.innerHTML = ""; // Clear loading text

    if (!snapshot.exists()) {
      container.innerHTML = `<p class="no-cards">No Persona Cards assigned yet.</p>`;
      return;
    }

    const data = snapshot.val();
    Object.entries(data).forEach(([cardId, card]) => {
      const cardElement = document.createElement("div");
      cardElement.className = "flip-card";
      cardElement.innerHTML = `
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <div class="card-title">${card.name || "Untitled Persona Card"}</div>
            <div class="card-section"><strong>Challenge:</strong> ${card.challenge || "N/A"}</div>
            <div class="card-section"><strong>Program:</strong> ${card.program || "N/A"}</div>
            <div class="points"><b>+ Points:</b> ${card.positives || "None"}</div>
            <div class="points"><b>- Points:</b> ${card.negatives || "None"}</div>
            <span class="date">📅 ${card.timestamp ? new Date(card.timestamp).toLocaleDateString() : "Unknown date"}</span>
          </div>
          <div class="flip-card-back">
            <div>${card.quote || "No quote provided."}</div>
          </div>
        </div>
      `;
      container.appendChild(cardElement);
    });

  } catch (err) {
    console.error("Error fetching persona cards:", err);
    container.innerHTML = `<p class="no-cards">❌ Error loading persona card.</p>`;
  }
})();
