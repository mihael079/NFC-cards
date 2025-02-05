import { db, auth } from "./firebase-config.js";
import { ref, get, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Wait until DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    const questionsList = document.getElementById("questionsList");

    if (!questionsList) {
        console.error("Error: questionsList element not found.");
        return;
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            loadAssignedQuestions(user.uid, questionsList);
        } else {
            questionsList.innerHTML = "<p>Please log in to see your assigned questions.</p>";
        }
    });
});

async function loadAssignedQuestions(userId, questionsList) {
  const questionsRef = ref(db, "questions/");
  try {
      const snapshot = await get(questionsRef);

      if (snapshot.exists()) {
          console.log("Fetched questions:", snapshot.val()); // Debugging log
          questionsList.innerHTML = "";

          snapshot.forEach((childSnapshot) => {
              const questionData = childSnapshot.val();
              console.log("Checking question:", questionData); // Debugging log

              if (questionData.assignedUser === userId) {
                  console.log("Displaying question:", questionData.questionText); // Debugging log
                  const questionDiv = document.createElement("div");
                  questionDiv.classList.add("question-item");
                  questionDiv.innerHTML = `
                      <p><strong>From:</strong> ${questionData.askerName}</p>
                      <p><strong>Question:</strong> ${questionData.questionText}</p>
                      <textarea id="answer-${childSnapshot.key}" placeholder="Enter your answer"></textarea>
                      <button onclick="submitAnswer('${childSnapshot.key}')">Submit Answer</button>
                  `;
                  questionsList.appendChild(questionDiv);
              }
          });

          if (questionsList.innerHTML === "") {
              questionsList.innerHTML = "<p>No questions assigned to you.</p>";
          }
      } else {
          console.log("No questions found in database.");
          questionsList.innerHTML = "<p>No questions assigned to you.</p>";
      }
  } catch (error) {
      console.error("Error loading questions:", error);
  }
}


// Attach submit function globally
window.submitAnswer = async function (questionId) {
    const answerField = document.getElementById(`answer-${questionId}`);
    const answer = answerField.value.trim();
    if (!answer) {
        alert("Please enter an answer before submitting.");
        return;
    }

    try {
        await update(ref(db, `questions/${questionId}`), { answer });
        alert("Answer submitted successfully!");
        answerField.value = ""; // Clear the field
    } catch (error) {
        console.error("Error submitting answer:", error);
        alert("Failed to submit answer. Please try again.");
    }
};
