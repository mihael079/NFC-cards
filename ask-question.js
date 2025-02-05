// ask-question.js
import { db, auth } from './firebase-config.js';
import { ref, push, set } from 'firebase/database';

// Get form and input elements
const questionForm = document.getElementById('question-form');
const questionInput = document.getElementById('question');

// Handle form submission
questionForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const questionText = questionInput.value.trim();

  if (questionText === '') {
    alert('Please enter a question.');
    return;
  }

  const userId = auth.currentUser ? auth.currentUser.uid : null;

  if (!userId) {
    alert('You must be logged in to ask a question.');
    return;
  }

  // Create a new reference for the question in Firebase
  const questionRef = ref(db, 'questions');
  const newQuestionRef = push(questionRef);

  // Set the question data in Firebase
  set(newQuestionRef, {
    question: questionText,
    userId: userId,
    answered: false,  // Mark the question as unanswered initially
  })
  .then(() => {
    alert('Your question has been submitted!');
    questionInput.value = '';  // Clear the input field
  })
  .catch((error) => {
    alert('Error submitting your question: ' + error.message);
  });
});
