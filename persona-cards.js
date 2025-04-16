import { db } from "./firebase-config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Get UID from URL
const uid = new URLSearchParams(window.location.search).get("uid");
const container = document.getElementById("personaContainer");

if (!uid) {
  container.innerHTML = "<p class='error'>❌ No UID provided in URL.</p>";
  throw new Error("No UID");
}

// Fetch display name from Firebase
get(ref(db, `users/${uid}`))
  .then(snapshot => {
    if (!snapshot.exists()) throw new Error("User not found.");
    const displayName = snapshot.val().displayName;
    if (!displayName) throw new Error("Missing display name.");
    loadPersonaImages(displayName);
  })
  .catch(err => {
    container.innerHTML = `<p class="error">❌ ${err.message}</p>`;
  });

function loadPersonaImages(folder) {
  container.innerHTML = "";
  const maxCards = 30;
  let loaded = 0;
  let checked = 0;

  for (let i = 1; i <= maxCards; i++) {
    const frontPath = `persona-cards/${folder}/card${i}front.png`;
    const backPath = `persona-cards/${folder}/card${i}back.png`;

    checkImage(frontPath, (frontExists) => {
      checkImage(backPath, (backExists) => {
        checked++;
        if (frontExists && backExists) {
          const card = createFlipCard(frontPath, backPath);
          container.appendChild(card);
          loaded++;
        }
        if (checked === maxCards && loaded === 0) {
          container.innerHTML = "<p>No persona cards found for this user.</p>";
        }
      });
    });
  }
}

function checkImage(url, callback) {
  const img = new Image();
  img.onload = () => callback(true);
  img.onerror = () => callback(false);
  img.src = url;
}

function createFlipCard(front, back) {
  const wrapper = document.createElement("div");
  wrapper.className = "flip-card";

  wrapper.innerHTML = `
    <div class="flip-card-inner">
      <div class="flip-card-front">
        <img src="${front}" alt="Front of Card">
      </div>
      <div class="flip-card-back">
        <img src="${back}" alt="Back of Card">
      </div>
    </div>
  `;

  return wrapper;
}
