import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { app } from "./firebase-config.js";

const db = getDatabase(app);

document.addEventListener("DOMContentLoaded", () => {
    const questionsList = document.getElementById("questionsList");
    
    if (!questionsList) {
        console.error("Element with ID 'questionsList' not found!");
        return;
    }

    loadAllQuestions(questionsList);
});

async function loadAllQuestions(questionsList) {
    const questionsRef = ref(db, "questions/");
    try {
        const snapshot = await get(questionsRef);

        if (snapshot.exists()) {
            console.log("Fetched public questions:", snapshot.val()); // Debugging log
            questionsList.innerHTML = "";

            snapshot.forEach((childSnapshot) => {
                const questionData = childSnapshot.val();
                console.log("Displaying question:", questionData.questionText); // Debugging log

                const questionDiv = document.createElement("div");
                questionDiv.classList.add("question-item");
                questionDiv.innerHTML = `
                    <p><strong>From:</strong> ${questionData.askerName}</p>
                    <p><strong>Question:</strong> ${questionData.questionText}</p>
                    <p><strong>Answer:</strong> ${questionData.answer || "No answer yet."}</p>
                `;
                questionsList.appendChild(questionDiv);
            });

            if (questionsList.innerHTML === "") {
                questionsList.innerHTML = "<p>No public questions available.</p>";
            }
        } else {
            console.log("No public questions found.");
            questionsList.innerHTML = "<p>No public questions available.</p>";
        }
    } catch (error) {
        console.error("Error loading public questions:", error);
    }
}
