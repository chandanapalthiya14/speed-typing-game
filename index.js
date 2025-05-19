const wordDisplay = document.getElementById("word-display");
const wordInput = document.getElementById("word-input");
const timeDisplay = document.getElementById("time");
const scoreDisplay = document.getElementById("score");
const progress = document.getElementById("progress");
const restartBtn = document.getElementById("restart-btn");
const levelButtons = document.querySelectorAll(".level-btn");

let words = ["ocean", "banana", "laptop", "python", "dream", "light", "future", "speed", "typing", "focus"];
let currentWord = "";
let timeLeft = 0;
let score = 0;
let gameInterval;

levelButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    timeLeft = parseInt(btn.dataset.time);
    score = 0;
    scoreDisplay.textContent = 0;
    wordInput.disabled = false;
    wordInput.value = "";
    wordInput.focus();
    nextWord();
    clearInterval(gameInterval);
    gameInterval = setInterval(updateTime, 1000);
  });
});

function nextWord() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  wordDisplay.textContent = currentWord;
}

function updateTime() {
  if (timeLeft > 0) {
    timeLeft--;
    timeDisplay.textContent = timeLeft;
    progress.value = (timeLeft / parseInt(progress.max)) * 100;
  } else {
    clearInterval(gameInterval);
    wordInput.disabled = true;
    wordDisplay.textContent = "Game Over!";
  }
}

wordInput.addEventListener("input", () => {
  if (wordInput.value === currentWord) {
    score++;
    scoreDisplay.textContent = score;
    wordInput.value = "";
    timeLeft += 2;
    nextWord();
  }
});

restartBtn.addEventListener("click", () => {
  window.location.reload();
});

