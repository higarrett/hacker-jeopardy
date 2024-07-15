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
  // Code Names
  'cat1-1000': { question: 'Jaguar, Panther, Tiger, Leopard, Snow Leopard, Lion, Mountain Lion', answer: 'Answer: Mac OS', dailyDouble: false },
  'cat1-2000': { question: 'Natty Narwhal, Xenial Xerus, Bionic Beaver, Focal Fossa, Jammy Jellyfish', answer: 'Answer: Ubuntu', dailyDouble: false },
  'cat1-3000': { question: 'Chicago, Daytona, Memphis, Whistler, Longhorn, Blackcomb, Blue', answer: 'Answer: Windows', dailyDouble: true },
  'cat1-4000': { question: 'Question 1 for Cat 1 - 4000', answer: 'Answer 1 for Cat 1 - 4000', dailyDouble: false },
  'cat1-5000': { question: 'Yohan, Meron, Penryn, Sandy, Bridge, Haswell', answer: 'Answer: Intel Processors', dailyDouble: false },

  // TLEs
  'cat2-1000': { question: 'The words abbreviated by ".csv"', answer: 'Answer: Comma Separated Variables/Values', dailyDouble: false },
  'cat2-2000': { question: 'The words abbreviated by ".pdf"', answer: 'Answer: Portable Document Format', dailyDouble: false },
  'cat2-3000': { question: 'The words abbreviated by ".mp3"', answer: 'Answer: Joint Photographic Experts Group', dailyDouble: false },
  'cat2-4000': { question: 'The words abbreviated by ".tar"', answer: 'Answer: Tape Archive', dailyDouble: false },
  'cat2-5000': { question: 'The words abbreviated by ".html"', answer: 'Answer: HyperText Markup Language', dailyDouble: false },

  // Hard CIDR              
  'cat3-1000': { question: 'A /24 network with a host of 192.168.0.100 has this subnet mask', answer: 'Answer: 255.255.255.0', dailyDouble: false },
  'cat3-2000': { question: 'A /26 network has how many addresses (estimate)', answer: 'Answer: 65,534', dailyDouble: false },
  'cat3-3000': { question: 'The C in CIDR stands for this, also a not great person', answer: 'Answer: Classless', dailyDouble: false },
  'cat3-4000': { question: 'A /29 network has how many usable addresses', answer: 'Answer: 6', dailyDouble: false },
  'cat3-5000': { question: 'A /31 subnet is typically used for this', answer: 'Answer: Point-to-Point links', dailyDouble: false },

  // Randomness  
  'cat4-1000': { question: 'The default port that DNS uses', answer: 'Answer: 53', dailyDouble: false },
  'cat4-2000': { question: 'The numerical code for a successful HTTP request?', answer: 'Answer: 200', dailyDouble: false },
  'cat4-3000': { question: 'The default port that telnet uses', answer: 'Answer: 23', dailyDouble: true },
  'cat4-4000': { question: 'Pi with at least 8 digits to the right of the decimal point', answer: 'Answer: 3.14159265', dailyDouble: false },
  'cat4-5000': { question: 'What is the answer to the ultimate question of life, the universe and everything', answer: 'Answer: 42', dailyDouble: false },

  // Security Acronyms
  'cat5-1000': { question: 'SIEM', answer: 'Answer: Security Information and Event Management', dailyDouble: false },
  'cat5-2000': { question: 'CISO', answer: 'Answer: Chief Information Security Officer', dailyDouble: false },
  'cat5-3000': { question: 'ISACA', answer: 'Answer: Information Systems Audit and Control Association', dailyDouble: false },
  'cat5-4000': { question: 'SANS', answer: 'Answer: System Administration, Networking and Security Institute', dailyDouble: true },
  'cat5-5000': { question: 'RBAC', answer: 'Answer: Role-Based Access Control', dailyDouble: false }
};

let currentBuzzer = null;
const dailyDoubleWagers = {};

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
    if (questionData.dailyDouble) {
      io.emit('show-daily-double-banner');
      setTimeout(() => {
        io.emit('show-question', { questionId, question: questionData.question });
        socket.emit('show-answer', questionData.answer);
        io.emit('question-opened', questionId); // Notify all clients to hide the question
      }, 3000); // 3 seconds delay for the banner
    } else {
      io.emit('show-question', { questionId, question: questionData.question });
      socket.emit('show-answer', questionData.answer);
      io.emit('question-opened', questionId); // Notify all clients to hide the question
    }
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

  socket.on('daily-double-wager', (data) => {
    dailyDoubleWagers[data.questionId] = data.wager;
    const questionData = questions[data.questionId];
    io.emit('show-question', { questionId: data.questionId, question: questionData.question });
    socket.emit('show-answer', questionData.answer);
    io.emit('question-opened', data.questionId); // Notify all clients to hide the question
  });

  socket.on('close-question', () => {
    io.emit('clear-question');
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
