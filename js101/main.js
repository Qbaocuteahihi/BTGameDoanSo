const introCard = document.getElementById("introCard");
const indicatorWave = document.getElementById("indicatorWave");
const guessCard = document.getElementById("guessCard");
const guessInput = document.getElementById("guessInput");
const btGuess = document.getElementById("btGuess");
const gameOverCard = document.getElementById("gameOverCard");
const winCard = document.getElementById("winCard");
const canvas = document.getElementById("canvas");
const lbPrompt = document.getElementById("lbPrompt");
const lbTimeTaken = document.getElementById("lbTimeTaken");
const timerElement = document.getElementById("timer");

const tmpIndicatorDisplayType = indicatorWave.style.display;
const tmpGuessCardDisplayType = guessCard.style.display;

// disable indicatorWave
indicatorWave.style.display = "none";
// disable guessCard
guessCard.style.display = "none";
// disable gameOverCard
gameOverCard.style.display = "none";
// disable winCard
winCard.style.display = "none";

let mysteryNumber = Math.floor(Math.random() * 100) + 1;
let lives = 5;
let timer;
let startTime;

const audioTLO = new Audio("./assets/TLO.mp3");

introCard.onclick = () => {
  audioTLO.currentTime = 0;
  audioTLO.play();
  mysteryNumber = Math.floor(Math.random() * 100) + 1;
  console.log(mysteryNumber);
  lives = 5;
  document.documentElement.style.setProperty(
    "--tube-percentage",
    (5 - lives) * 20 + "%"
  );
  // start the game
  introCard.classList.add("zoomOutAndFadeOut");
  setTimeout(() => {
    introCard.style.display = "none";
    indicatorWave.style.display = tmpIndicatorDisplayType;
    guessCard.style.display = tmpGuessCardDisplayType;
    gameOverCard.style.display = "none";
    winCard.style.display = "none";
    canvas.style.display = "none";
    startTimer();
  }, 1000);
};

btGuess.onclick = () => {
  const guess = parseInt(guessInput.value);
  // set css variables --tube-percentage
  document.documentElement.style.setProperty(
    "--tube-percentage",
    (5 - lives) * 20 + "%"
  );

  if (guess === mysteryNumber) {
    guessCard.style.display = "none";
    winCard.style.display = tmpGuessCardDisplayType;
    let lbResultOnWin = document.getElementById("lbResultOnWin");
    let elapsedTime = (Date.now() - startTime) / 1000;
    let minutes = Math.floor(elapsedTime / 60);
    let seconds = Math.floor(elapsedTime % 60);
    lbResultOnWin.innerHTML = `Đáp Án Là ${mysteryNumber}`;
    lbTimeTaken.innerHTML = `Bạn hoàn thành thử thách này trong ${minutes} phút ${seconds} giây.`;

    new Audio("./assets/correct.mp3").play();
    stopTimer();
    startConfetti();
  } else if (guess < mysteryNumber) {
    lbPrompt.innerHTML = "Bạn Đoán Thấp Quá Rồi. Làm Lại Nào. ";
    // play sound wrong.mp3
    new Audio("./assets/wrong.mp3").play();
  } else {
    lbPrompt.innerHTML = "Bạn Đoán Cao Quá Rồi. Làm Lại Nào.";
    new Audio("./assets/wrong.mp3").play();
  }
  lives--;
  if (lives === 0) {
    guessCard.style.display = "none";
    gameOverCard.style.display = tmpGuessCardDisplayType;
    let lbResultOnOver = document.getElementById("lbResultOnOver");
    lbResultOnOver.innerHTML = `Đáp Án Là ${mysteryNumber}`;
    stopTimer();
  }

  console.log(guess);
};
const btRestart = document.getElementById("btRestart");

function restartGame() {
  mysteryNumber = Math.floor(Math.random() * 100) + 1;
  lives = 5;
  document.documentElement.style.setProperty(
    "--tube-percentage",
    (5 - lives) * 20 + "%"
  );
  introCard.classList.remove("zoomOutAndFadeOut");
  introCard.style.display = tmpGuessCardDisplayType;
  indicatorWave.style.display = "none";
  guessCard.style.display = "none";
  gameOverCard.style.display = "none";
  winCard.style.display = "none";
  guessInput.value = "";
  stopConfetti();
  startTimer();
  audioTLO.currentTime = 0;
  audioTLO.play();
}

function startTimer() {
  startTime = Date.now();
  timer = setInterval(() => {
    let elapsedTime = (Date.now() - startTime) / 1000;
    let minutes = Math.floor(elapsedTime / 60);
    let seconds = Math.floor(elapsedTime % 60);
    timerElement.innerHTML = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}
btRestart.onclick = () => {
  restartGame();
};

function startConfetti() {
  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.style.display = "block";
  const context = canvas.getContext("2d");
  const maxConfettis = 150;
  const particles = [];

  const possibleColors = [
    "DodgerBlue",
    "OliveDrab",
    "Gold",
    "Pink",
    "SlateBlue",
    "LightBlue",
    "Gold",
    "Violet",
    "PaleGreen",
    "SteelBlue",
    "SandyBrown",
    "Chocolate",
    "Crimson",
  ];

  function randomFromTo(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
  }

  function confettiParticle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H - H;
    this.r = randomFromTo(11, 33);
    this.d = Math.random() * maxConfettis + 11;
    this.color =
      possibleColors[Math.floor(Math.random() * possibleColors.length)];
    this.tilt = Math.floor(Math.random() * 33) - 11;
    this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
    this.tiltAngle = 0;

    this.draw = function () {
      context.beginPath();
      context.lineWidth = this.r / 2;
      context.strokeStyle = this.color;
      context.moveTo(this.x + this.tilt + this.r / 3, this.y);
      context.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5);
      return context.stroke();
    };
  }

  function Draw() {
    const results = [];
    requestAnimationFrame(Draw);
    context.clearRect(0, 0, W, window.innerHeight);
    for (var i = 0; i < maxConfettis; i++) {
      results.push(particles[i].draw());
    }

    let particle = {};
    let remainingFlakes = 0;
    for (var i = 0; i < maxConfettis; i++) {
      particle = particles[i];
      particle.tiltAngle += particle.tiltAngleIncremental;
      particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 2;
      particle.tilt = Math.sin(particle.tiltAngle - i / 3) * 15;

      if (particle.y <= H) remainingFlakes++;

      if (particle.x > W + 30 || particle.x < -30 || particle.y > H) {
        particle.x = Math.random() * W;
        particle.y = -30;
        particle.tilt = Math.floor(Math.random() * 10) - 20;
      }
    }

    return results;
  }

  window.addEventListener(
    "resize",
    function () {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    },
    false
  );

  for (var i = 0; i < maxConfettis; i++) {
    particles.push(new confettiParticle());
  }

  canvas.width = W;
  canvas.height = H;
  Draw();
}

function stopConfetti() {
  canvas.style.display = "none";
}
