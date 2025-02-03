import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBEIGffCj6b7RTU0hjW8Z4BXlrzFVZFL-s",  // Keep this private!
    authDomain: "nfc-cards-dfa6b.firebaseapp.com",
    projectId: "nfc-cards-dfa6b",
    storageBucket: "nfc-cards-dfa6b.appspot.com",
    messagingSenderId: "321725769305",
    appId: "1:321725769305:web:42e79fd85cc6029b97f348",
    databaseURL: "https://nfc-cards-dfa6b-default-rtdb.firebaseio.com/"
  };
  

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };
