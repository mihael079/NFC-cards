// persona-cards.js  (correct path prefix)
import { db } from "./firebase-config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const params   = new URLSearchParams(location.search);
const uid      = params.get("uid");
const deckElem = document.getElementById("deck");

if (!uid) {
  deckElem.innerHTML = "<p class='error'>❌ UID missing in URL.</p>";
  throw new Error("UID missing");
}

// 1️⃣ fetch displayName  → folder name
get(ref(db, `users/${uid}`))
  .then(snap => {
    if (!snap.exists()) throw new Error("User not found.");
    const folder = snap.val().displayName;
    if (!folder) throw new Error("Display name missing.");
    loadCardBack(1, folder);
  })
  .catch(err => deckElem.innerHTML = `<p class="error">❌ ${err.message}</p>`);

// 2️⃣ load card backs recursively
function loadCardBack(n, folder) {
  // include persona-cards/ top-level folder:
  const backSrc = `persona-cards/${folder}/card${n}back.png`;

  const probe = new Image();
  probe.src = backSrc;

  probe.onload = () => {
    const img = document.createElement("img");
    img.src       = backSrc;
    img.alt       = `Card ${n}`;
    img.className = "card-back";
    img.onclick   = () => location.href = `persona-view.html?uid=${uid}&card=${n}`;
    deckElem.appendChild(img);
    loadCardBack(n + 1, folder);            // try the next index
  };

  probe.onerror = () => {
    if (n === 1 && deckElem.children.length === 0) {
      deckElem.innerHTML = "<p>No persona cards found for this user.</p>";
    }
    // stop probing after first miss
  };
}
