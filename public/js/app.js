const socket = io();

function openQuestion(questionId) {
  socket.emit('open-question', questionId);
}

socket.on('update', (data) => {
  document.getElementById('team1-score').textContent = `Team 1: ${data.scores.team1}`;
  document.getElementById('team2-score').textContent = `Team 2: ${data.scores.team2}`;
  document.getElementById('team3-score').textContent = `Team 3: ${data.scores.team3}`;
  document.getElementById('buzzer-status').textContent = data.currentBuzzer ? `${data.currentBuzzer}!` : '';
});

socket.on('show-question', (questionData) => {
  const { questionId, question } = questionData;
  const questionModal = document.getElementById('question-modal');
  const questionContent = document.getElementById('question-content');
  
  questionModal.style.display = 'flex';
  questionContent.textContent = question;

  // Adjust font size based on the length of the question
  if (question.length > 100) {
    questionModal.style.fontSize = '2em';
  } else if (question.length > 50) {
    questionModal.style.fontSize = '2.5em';
  } else {
    questionModal.style.fontSize = '3em';
  }

  document.getElementById(questionId).style.visibility = 'hidden';
});


socket.on('clear-question', () => {
  document.getElementById('question-modal').style.display = 'none';
});
