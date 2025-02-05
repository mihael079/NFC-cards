// answer-question.js
import { db, auth } from './firebase-config.js';
import { ref, set, get, child } from 'firebase/database';

const urlParams = new URLSearchParams(window.location.search);
const questionId = urlParams.get('questionId');
const questionTextDiv = document.getElementById('question-text');
const answerForm = document.getElementById('answer-form');
const answerInput = document.getElementById('answer');

// Fetch the question from Firebase using the questionId
get(child(ref(db), 'questions/' + questionId)).then((snapshot) => {
  if (snapshot.exists()) {
    const question = snapshot.val();
    questionTextDiv.innerHTML = `<p><strong>Question:</strong> ${question.question}</p>`;
  } else {
    questionTextDiv.innerHTML = '<p>Question not found.</p>';
  }
}).catch((error) => {
  console.error('Error fetching question:', error);
});

// Handle answer submission
answerForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const answerText = answerInput.value.trim();
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  if (answerText === '') {
    alert('Please enter an answer.');
    return;
  }

  if (!userId) {
    alert('You must be logged in to submit an answer.');
    return;
  }

  // Create a reference for the answer in Firebase
  const answerRef = ref(db, 'answers/' + questionId);
  set(answerRef, {
    answer: answerText,
    userId: userId,
    answeredAt: new Date().toISOString(),
  })
  .then(() => {
    alert('Your answer has been submitted!');
    answerInput.value = '';  // Clear the input field
  })
  .catch((error) => {
    alert('Error submitting your answer: ' + error.message);
  });
});
