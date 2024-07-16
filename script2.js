var score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let cross = true;
let gameOverFlag = false;
let obstacleSpeed = 2; // Initial speed of the obstacle

audio = new Audio('invincible.mp3');
audiogo = new Audio('gameover.mp3');
setTimeout(() =>{
  audio.play();
},1000)  //1000 -> 1s

// Function to update the high score in the UI and local storage
async function updateHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
    console.log("Updated High Score:", highScore); // Debugging output
    document.getElementById('highScore').textContent = "High Score: " + highScore;
  }
}

// Function to update the obstacle speed based on the score
function updateObstacleSpeed() {
  obstacleSpeed = 2 - Math.min(score * 0.1, 1.5); // Increase speed as score increases, with a cap
  let obstacle = document.querySelector('.obstacle');
  obstacle.style.animationDuration = `${obstacleSpeed}s`;
}

document.addEventListener('keydown', function(e) {
  if (gameOverFlag) return; // Stop the game logic if game is over

  let cena = document.querySelector('.cena');
  let cenaX = parseInt(window.getComputedStyle(cena, null).getPropertyValue('left'));

  if (e.key === 'ArrowUp') {
    if (!cena.classList.contains('animateCena')) {
      cena.classList.add('animateCena');
      setTimeout(() => {
        cena.classList.remove('animateCena');
      }, 1500); // 1500 milliseconds
    }
  }

  if (e.key === 'ArrowRight') {
    if (cenaX < window.innerWidth - cena.clientWidth) {
      cena.style.left = (cenaX + 250) + "px"; // Move cena to the right by 250 pixels
    }
  }

  if (e.key === 'ArrowLeft') {
    if (cenaX > 0) {
      cena.style.left = (cenaX - 250) + "px"; // Move cena to the left by 250 pixels
    }
  }
});

// Checking collision and updating score
setInterval(() => {
  if (gameOverFlag) return; // Stop the game logic if game is over

  let cena = document.querySelector('.cena');
  let gameOver = document.querySelector('.gameOver');
  let obstacle = document.querySelector('.obstacle');

  let cenaRect = cena.getBoundingClientRect();
  let obstacleRect = obstacle.getBoundingClientRect(); // Accurate info about the positions of boxes containing cena and the obstacle

  console.log("Cena:", cenaRect);
  console.log("Obstacle:", obstacleRect);

  // Check if the rectangles overlap
  if (
    cenaRect.left < obstacleRect.right &&
    cenaRect.right > obstacleRect.left &&
    cenaRect.top < obstacleRect.bottom &&
    cenaRect.bottom > obstacleRect.top
  ) {
    console.log("Collision detected");
    gameOver.style.visibility = 'visible';
    obstacle.classList.remove('obstacleAni');

    // Update High Score when game over
    updateHighScore();

    // Update Current Score (optional)
    document.getElementById('currentScore').textContent = "Your Score: " + score;

    gameOverFlag = true; // Set the game over flag to true
  } else if (Math.abs(cenaRect.right - obstacleRect.left) < 145 && cross) {
    score += 1;
    document.getElementById('currentScore').textContent = "Your Score: " + score;

    // Update High Score on score increase
    updateHighScore();

    // Update obstacle speed
    updateObstacleSpeed();

    cross = false;
    setTimeout(() => {
      cross = true;
    }, 1000);
  }
}, 100);



