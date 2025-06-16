// persona-view.js
import { db } from "./firebase-config.js";
import { ref, get, push } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const params = new URLSearchParams(location.search);
const uid    = params.get("uid");
const cardId = params.get("card");

const imgEl      = document.getElementById("cardImage");
const statusEl   = document.getElementById("status");
const backLinkEl = document.getElementById("backLink");

if (!uid || !cardId) {
  statusEl.textContent = "Missing UID or card number in URL.";
  throw new Error("UID or card missing");
}

// 1️⃣ Fetch displayName so we know the folder name
get(ref(db, `users/${uid}`))
  .then(snap => {
    if (!snap.exists()) throw new Error("User not found.");
    const displayName = snap.val().displayName;
    if (!displayName) throw new Error("Display name missing.");

    // Set front image source
    imgEl.src = `persona-cards/${displayName}/card${cardId}front.png`;

    // Set back-to-deck link
    backLinkEl.href = `persona-cards.html?uid=${uid}`;
  })
  .catch(err => { statusEl.textContent = err.message; });


// 2️⃣ Handle feedback submission
document.getElementById("feedbackForm").addEventListener("submit", async (e)=>{
  e.preventDefault();

  const feedback = {
    impression : document.getElementById("impression").value.trim(),
    intensity  : document.getElementById("intensity").value,
    performance: document.getElementById("performance").value.trim(),
    card       : cardId,
    submittedAt: new Date().toISOString()
  };

  if (!feedback.impression || !feedback.performance) {
    statusEl.textContent = "Please complete all fields.";
    return;
  }

  try {
    await push(ref(db, `personaFeedback/${uid}`), feedback);
    statusEl.style.color = "green";
    statusEl.textContent = "Feedback submitted! Returning…";
    setTimeout(()=>location.href=`persona-cards.html?uid=${uid}`,1500);
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Error submitting feedback.";
  }
});
