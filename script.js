const wordsData = {
  easy: [
    { word: 'cat', hint: 'A small pet that purrs.' },
    { word: 'dog', hint: 'Man’s best friend.' },
    { word: 'cow', hint: 'Gives milk.' },
    { word: 'bat', hint: 'Flying mammal.' },
    { word: 'pig', hint: 'Farm animal that oinks.' },
    { word: 'rat', hint: 'Rodent with a long tail.' },
    { word: 'moon', hint: 'Earth’s satellite.' },
    { word: 'star', hint: 'Celestial object that twinkles.' },
    { word: 'apple', hint: 'A popular fruit.' },
    { word: 'ball', hint: 'A round object used in games.' }
  ],
  medium: [
    { word: 'giraffe', hint: 'Tallest animal.' },
    { word: 'dolphin', hint: 'Smart sea creature.' },
    { word: 'penguin', hint: 'Bird that cannot fly.' },
    { word: 'kangaroo', hint: 'A marsupial that hops.' },
    { word: 'elephant', hint: 'Largest land animal.' },
    { word: 'zebra', hint: 'Horse-like animal with stripes.' },
    { word: 'tiger', hint: 'Big cat found in jungles.' },
    { word: 'guitar', hint: 'Musical instrument with strings.' },
    { word: 'pyramid', hint: 'Ancient triangular structure.' }
  ],
  hard: [
    { word: 'chameleon', hint: 'Changes its color.' },
    { word: 'platypus', hint: 'Mammal that lays eggs.' },
    { word: 'hippopotamus', hint: 'Large herbivorous mammal.' },
    { word: 'armadillo', hint: 'Small mammal with a shell.' },
    { word: 'komodo', hint: 'Large species of lizard.' },
    { word: 'zeppelin', hint: 'Large rigid airship.' },
    { word: 'quixotic', hint: 'Idealistic but impractical.' },
    { word: 'zoology', hint: 'Study of animals.' },
    { word: 'renaissance', hint: 'Period of great cultural revival.' }
  ]
};

const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');
const winSound = document.getElementById('winSound');
const loseSound = document.getElementById('loseSound');

let selectedWord = '';
let displayedWord = [];
let wrongGuesses = 0;
const maxWrong = 6;
let hintUsed = false;
let score = 0;
let timer;
let timeRemaining = 60;
let usedWords = [];

const wordEl = document.getElementById('word');
const messageEl = document.getElementById('message');
const lettersEl = document.getElementById('letters');
const restartBtn = document.getElementById('restart');
const hintBtn = document.getElementById('hintBtn');
const canvas = document.getElementById('hangman');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');

// Start a new game
function startGame() {
  clearInterval(timer);

  const level = 'easy'; // Or dynamically adjust this based on user choice
  const wordList = wordsData[level];
  const availableWords = wordList.filter(wordObj => !usedWords.includes(wordObj.word));

  if (availableWords.length === 0) {
    messageEl.textContent = '🏆 All questions done! Game Over!';
    return;
  }

  const selected = availableWords[Math.floor(Math.random() * availableWords.length)];
  selectedWord = selected.word;
  usedWords.push(selectedWord);
  displayedWord = Array(selectedWord.length).fill('_');
  wrongGuesses = 0;
  hintUsed = false;
  timeRemaining = 60;

  updateWordDisplay();
  messageEl.textContent = '';
  restartBtn.style.display = 'none';
  lettersEl.innerHTML = '';
  clearCanvas();
  startTimer();

  for (let i = 65; i <= 90; i++) {
    const btn = document.createElement('button');
    btn.textContent = String.fromCharCode(i);
    btn.addEventListener('click', handleGuess);
    lettersEl.appendChild(btn);
  }

  hintBtn.style.display = 'inline-block';
  hintBtn.disabled = false;
}

// Start the timer for the game
function startTimer() {
  timerEl.textContent = `Time: ${timeRemaining}s`;
  timer = setInterval(() => {
    if (timeRemaining > 0) {
      timeRemaining--;
      timerEl.textContent = `Time: ${timeRemaining}s`;
    } else {
      clearInterval(timer);
      messageEl.textContent = `💀 Time's up! Word was: ${selectedWord}`;
      loseSound.play();
      endGame();
    }
  }, 1000);
}

// Update the display of the word
function updateWordDisplay() {
  wordEl.textContent = displayedWord.join(' ');
}

// Handle guess logic when a letter is clicked
function handleGuess(e) {
  const letter = e.target.textContent.toLowerCase();
  e.target.disabled = true;

  if (selectedWord.includes(letter)) {
    for (let i = 0; i < selectedWord.length; i++) {
      if (selectedWord[i] === letter) {
        displayedWord[i] = letter;
      }
    }
    updateWordDisplay();
    correctSound.play();

    if (!displayedWord.includes('_')) {
      clearInterval(timer);
      messageEl.textContent = '🎉 Correct! Next question...';
      score++;
      scoreEl.textContent = `Score: ${score}`;
      winSound.play();
      setTimeout(() => startGame(), 1500);
    }
  } else {
    wrongGuesses++;
    wrongSound.play();
    drawHangman(wrongGuesses);

    if (wrongGuesses >= maxWrong) {
      clearInterval(timer);
      messageEl.textContent = `💀 You Lost! Word was: ${selectedWord}`;
      loseSound.play();
      updateWordDisplay();
      setTimeout(() => startGame(), 1500);
    }
  }
}

// End the game and disable the buttons
function endGame() {
  const buttons = lettersEl.querySelectorAll('button');
  buttons.forEach(btn => btn.disabled = true);
  restartBtn.style.display = 'inline-block';
  hintBtn.style.display = 'none';
}

// Clear the canvas where hangman is drawn
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Draw the hangman figure depending on the number of wrong guesses
function drawHangman(stage) {
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#000';

  if (stage === 1) {
    ctx.beginPath();
    ctx.moveTo(10, 230);
    ctx.lineTo(190, 230);
    ctx.stroke();
  }
  if (stage === 2) {
    ctx.beginPath();
    ctx.moveTo(50, 230);
    ctx.lineTo(50, 20);
    ctx.lineTo(130, 20);
    ctx.lineTo(130, 50);
    ctx.stroke();
  }
  if (stage === 3) {
    ctx.beginPath();
    ctx.arc(130, 70, 20, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (stage === 4) {
    ctx.beginPath();
    ctx.moveTo(130, 90);
    ctx.lineTo(130, 150);
    ctx.stroke();
  }
  if (stage === 5) {
    ctx.beginPath();
    ctx.moveTo(130, 110);
    ctx.lineTo(100, 130);
    ctx.stroke();
  }
  if (stage === 6) {
    ctx.beginPath();
    ctx.moveTo(130, 110);
    ctx.lineTo(160, 130);
    ctx.stroke();
  }
}

hintBtn.addEventListener('click

 
