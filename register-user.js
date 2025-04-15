import { db, auth } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import {
  ref,
  set
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const registerBtn = document.getElementById("registerBtn");
const status = document.getElementById("status");

registerBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const displayName = document.getElementById("displayName").value.trim();

  if (!email || !password || !displayName) {
    status.textContent = "Please fill in all fields.";
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName });

    await set(ref(db, `users/${user.uid}`), {
      displayName,
      profilePic: "avatar1.jpg",
      bio: "",
      interests: "",
      talents: 0
    });

    status.textContent = "✅ Registration successful!";
    setTimeout(() => {
      window.location.href = "profile.html";
    }, 1500);
  } catch (error) {
    console.error("Registration error:", error);
    status.textContent = `❌ ${error.message}`;
  }
});
