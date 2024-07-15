const socket = io();

socket.on('update', (data) => {
  document.getElementById('team1-score').innerText = data.scores.team1;
  document.getElementById('team2-score').innerText = data.scores.team2;
  document.getElementById('team3-score').innerText = data.scores.team3;
  document.getElementById('buzzer-status').innerText = data.currentBuzzer ? `${data.currentBuzzer} buzzed!` : '';
});

socket.on('show-question', (data) => {
  const questionModal = document.getElementById('question-modal');
  const questionContent = document.getElementById('question-content');
  questionContent.innerHTML = `<h1>${data.question}</h1>`;
  questionModal.style.display = 'block';
});

socket.on('show-answer', (answer) => {
  document.getElementById('answer-content').innerText = answer;
});

socket.on('clear-question', () => {
  document.getElementById('question-modal').style.display = 'none';
});

socket.on('question-opened', (questionId) => {
  document.getElementById(questionId).style.visibility = 'hidden';
});

socket.on('show-daily-double-banner', () => {
  const banner = document.getElementById('daily-double-banner');
  banner.style.display = 'block';
  setTimeout(() => {
    banner.style.display = 'none';
  }, 3000); // 3 seconds delay for the banner
});
