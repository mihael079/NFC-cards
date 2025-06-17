import { db, auth } from "./firebase-config.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { ref, push } from
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const qText = document.getElementById("questionText");
const btn   = document.getElementById("submitQ");
const msgEl = document.getElementById("msg");

let uid = null;

onAuthStateChanged(auth, user => {
  if (!user){ msgEl.textContent="Log in first"; btn.disabled=true; return;}
  uid = user.uid;
});

btn.addEventListener("click", async ()=>{
  const txt = qText.value.trim();
  if (!txt){ msgEl.textContent="Write something first"; return; }

  try{
    await push(ref(db, `users/${uid}/questions`), {
      text: txt,
      createdAt: Date.now()
    });
    qText.value="";
    msgEl.style.color="green";
    msgEl.textContent="Question saved!";
  }catch(err){
    console.error(err);
    msgEl.style.color="red";
    msgEl.textContent="Error saving question.";
  }
});
