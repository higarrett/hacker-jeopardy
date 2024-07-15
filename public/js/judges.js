const socket = io();

function updateScore(team, points) {
  socket.emit('update-score', { team, points });
}

function clearScore(team) {
  socket.emit('clear-score', team);
}

function customScore(team) {
  const score = document.getElementById(`${team}-custom`).value;
  if (score !== '') {
    socket.emit('set-custom-score', { team, points: parseInt(score) });
  }
}

function openQuestion(questionId) {
  socket.emit('open-question', questionId);
}

function closeQuestion() {
  socket.emit('close-question');
}

function clearBuzzer() {
  socket.emit('clear-buzzer');
}

socket.on('update', (data) => {
  document.getElementById('buzzer-status').textContent = data.currentBuzzer ? `${data.currentBuzzer} !!!` : '';
});

socket.on('show-answer', (answer) => {
  const answerDisplay = document.getElementById('answer-display');
  const answerContent = document.getElementById('answer-content');
  answerContent.textContent = answer;
  answerDisplay.style.display = 'block';
});

socket.on('show-question', (questionData) => {
  if (questionData.dailyDouble) {
    const wagerDisplay = document.getElementById('daily-double-wager');
    const wagerContent = document.getElementById('wager-content');
    wagerContent.textContent = `Wager: ${dailyDoubleWagers[questionData.questionId] || 0}`;
    wagerDisplay.style.display = 'block';
  }
});

socket.on('clear-question', () => {
  document.getElementById('answer-display').style.display = 'none';
  document.getElementById('daily-double-wager').style.display = 'none';
});
