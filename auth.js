import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const errorMsg = document.getElementById("errorMsg");

loginBtn.addEventListener("click", async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "profile.html";  // Redirect to profile after login
    } catch (error) {
        errorMsg.innerText = error.message;  // Show error message
    }
});

// Redirect logged-in users
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = "profile.html";
    }
});
