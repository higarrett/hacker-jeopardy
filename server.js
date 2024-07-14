const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const scores = {
  team1: 0,
  team2: 0,
  team3: 0,
};

const questions = {
  'cat1-1000': { question: 'How big is this line and how big can it get? How big is this line and how big can it get? How big is this line and how big can it get? How big is this line and how big can it get? How big is this line and how big can it get? How big is this line and how big can it get? How big is this line and how big can it get? ', answer: 'Answer 1 for Cat 1 - 1000' },
  'cat2-1000': { question: 'Something small', answer: 'Answer 2 for Cat 2 - 1000' },
  'cat3-1000': { question: 'Something medium size but nothing completely crazy', answer: 'Answer 3 for Cat 3 - 1000' },
  'cat4-1000': { question: 'Question 3 for Cat 3 - 1000', answer: 'Answer 3 for Cat 3 - 1000' },
  'cat5-1000': { question: 'Question 3 for Cat 3 - 1000', answer: 'Answer 3 for Cat 3 - 1000' },
  'cat1-2000': { question: 'Question 1 for Cat 1 - 2000', answer: 'Answer 1 for Cat 1 - 2000' },
  'cat2-2000': { question: 'Question 2 for Cat 2 - 2000', answer: 'Answer 2 for Cat 2 - 2000' },
  'cat3-2000': { question: 'Question 3 for Cat 3 - 2000', answer: 'Answer 3 for Cat 3 - 2000' },
  'cat4-2000': { question: 'Question 3 for Cat 3 - 2000', answer: 'Answer 3 for Cat 3 - 2000' },
  'cat5-2000': { question: 'Question 3 for Cat 3 - 2000', answer: 'Answer 3 for Cat 3 - 2000' },
  'cat1-3000': { question: 'Question 1 for Cat 1 - 3000', answer: 'Answer 1 for Cat 1 - 3000' },
  'cat2-3000': { question: 'Question 2 for Cat 2 - 3000', answer: 'Answer 2 for Cat 2 - 3000' },
  'cat3-3000': { question: 'Question 3 for Cat 3 - 3000', answer: 'Answer 3 for Cat 3 - 3000' },
  'cat4-3000': { question: 'Question 3 for Cat 3 - 3000', answer: 'Answer 3 for Cat 3 - 3000' },
  'cat5-3000': { question: 'Question 3 for Cat 3 - 3000', answer: 'Answer 3 for Cat 3 - 3000' },
  'cat1-4000': { question: 'Question 1 for Cat 1 - 4000', answer: 'Answer 1 for Cat 1 - 4000' },
  'cat2-4000': { question: 'Question 2 for Cat 2 - 4000', answer: 'Answer 2 for Cat 2 - 4000' },
  'cat3-4000': { question: 'Question 3 for Cat 3 - 4000', answer: 'Answer 3 for Cat 3 - 4000' },
  'cat4-4000': { question: 'Question 3 for Cat 3 - 4000', answer: 'Answer 3 for Cat 3 - 4000' },
  'cat5-4000': { question: 'Question 3 for Cat 3 - 4000', answer: 'Answer 3 for Cat 3 - 4000' },
  'cat1-5000': { question: 'Question 1 for Cat 1 - 5000', answer: 'Answer 1 for Cat 1 - 5000' },
  'cat2-5000': { question: 'Question 2 for Cat 2 - 5000', answer: 'Answer 2 for Cat 2 - 5000' },
  'cat3-5000': { question: 'Question 3 for Cat 3 - 5000', answer: 'Answer 3 for Cat 3 - 5000' },
  'cat4-5000': { question: 'Question 3 for Cat 3 - 5000', answer: 'Answer 3 for Cat 3 - 5000' },
  'cat5-5000': { question: 'Question 3 for Cat 3 - 5000', answer: 'Answer 3 for Cat 3 - 5000' }

  // Add all other questions here...
};

let currentBuzzer = null;

io.on('connection', (socket) => {
  socket.emit('update', { scores, currentBuzzer });

  socket.on('update-score', (data) => {
    scores[data.team] += data.points;
    io.emit('update', { scores, currentBuzzer });
  });

  socket.on('clear-score', (team) => {
    scores[team] = 0;
    io.emit('update', { scores, currentBuzzer });
  });

  socket.on('set-custom-score', (data) => {
    scores[data.team] = data.points;
    io.emit('update', { scores, currentBuzzer });
  });

  socket.on('open-question', (questionId) => {
    const questionData = questions[questionId];
    io.emit('show-question', { questionId, question: questionData.question });
    socket.emit('show-answer', questionData.answer);
  });

  socket.on('close-question', () => {
    io.emit('clear-question');
  });

  socket.on('buzz', (team) => {
    if (!currentBuzzer) { // Only register the first buzzer
      currentBuzzer = team;
      io.emit('update', { scores, currentBuzzer });
    }
  });

  socket.on('clear-buzzer', () => {
    currentBuzzer = null;
    io.emit('update', { scores, currentBuzzer });
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
