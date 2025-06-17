// answer-me.js – Guest evaluates host’s questions
import { db } from "./firebase-config.js";
import { ref, get, push } from
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const qs      = new URLSearchParams(location.search);
let hostUid   = qs.get("uid") || sessionStorage.getItem("hostUid");
const list    = document.getElementById("list");

if (!hostUid) {
  list.innerHTML = "<p>UID missing – open this page via a profile.</p>";
  throw new Error("UID missing");
}
// If query param exists, cache in sessionStorage for refreshes without param
sessionStorage.setItem("hostUid", hostUid);

// ---------- Load host questions ----------
get(ref(db, `users/${hostUid}/questions`))
  .then(snap => {
    if (!snap.exists()) { list.innerHTML = "<p>No questions from this host yet.</p>"; return; }
    list.innerHTML = "";
    Object.entries(snap.val())
      .reverse()                              // newest first
      .forEach(([qid, obj]) => renderCard(qid, obj.text ?? obj));
  })
  .catch(err => { console.error(err); list.innerHTML = "<p>Error loading questions.</p>"; });

// ---------- Render one card ----------
function renderCard(qid, text) {
  const wrap = document.createElement("div");
  wrap.className = "q-card";
  wrap.innerHTML = `
    <h3>Q: ${text}</h3>

    <label>➕ Plus Points</label>
    <textarea rows="2" class="plus"></textarea>

    <label>➖ Minus Points</label>
    <textarea rows="2" class="minus"></textarea>

    <label>Score (0-10)</label>
    <input type="range" min="0" max="10" value="5" class="scoreRange">
    <div class="slideVal">5</div>

    <button class="submitBtn"><i class="fa-solid fa-paper-plane"></i> Submit</button>
    <div class="localMsg"></div>
  `;
  list.appendChild(wrap);

  // interaction refs
  const plus   = wrap.querySelector(".plus");
  const minus  = wrap.querySelector(".minus");
  const range  = wrap.querySelector(".scoreRange");
  const valLbl = wrap.querySelector(".slideVal");
  const msgLbl = wrap.querySelector(".localMsg");

  // live score label & lighting
  range.oninput = () => {
    valLbl.textContent = range.value;
    const hue  = 40 + range.value * 3; // yellow→orange
    range.style.background =
      `linear-gradient(90deg, hsl(${hue} 100% 50%) ${range.value*10}%, #ddd 0%)`;
  };
  range.oninput(); // init

  // submit
  wrap.querySelector(".submitBtn").onclick = async () => {
    if (!plus.value.trim() && !minus.value.trim()) {
      msgLbl.textContent = "Write feedback first."; return;
    }
    try {
      await push(ref(db, `users/${hostUid}/questions/${qid}/reviews`), {
        plus:  plus.value.trim(),
        minus: minus.value.trim(),
        score: +range.value,
        createdAt: Date.now()
      });
      msgLbl.style.color = "green";
      msgLbl.textContent = "Thanks! Recorded ✔";
      plus.value = minus.value = "";
    } catch (err) {
      console.error(err);
      msgLbl.style.color = "red";
      msgLbl.textContent = "Error saving feedback.";
    }
  };
}
