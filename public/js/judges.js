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
  document.getElementById('answer-display').style.display = 'block';
  document.getElementById('answer-content').textContent = answer;
});
