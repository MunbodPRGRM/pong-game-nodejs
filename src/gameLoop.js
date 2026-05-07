const { gameState, resetBall, resetGame, WINNING_SCORE } = require('./gameState');

function startGameLoop(io) {
  setInterval(() => {
    if (gameState.status === 'playing') {
      gameState.ball.x += gameState.ball.dx;
      gameState.ball.y += gameState.ball.dy;

      // เด้งขอบบน-ล่าง
      if (gameState.ball.y + gameState.ball.radius > 600 || gameState.ball.y - gameState.ball.radius < 0) {
        gameState.ball.dy *= -1;
      }

      // --- ตรวจจับการชน ไม้ตี 1 (ฝั่งซ้าย) ---
      if (gameState.ball.x - gameState.ball.radius < gameState.paddle1.x + gameState.paddle1.width &&
          gameState.ball.y > gameState.paddle1.y &&
          gameState.ball.y < gameState.paddle1.y + gameState.paddle1.height) {
        
        let collidePoint = (gameState.ball.y - (gameState.paddle1.y + gameState.paddle1.height / 2));
        collidePoint = collidePoint / (gameState.paddle1.height / 2);
        let angleRad = (Math.PI / 4) * collidePoint;
        let currentSpeed = Math.sqrt(gameState.ball.dx**2 + gameState.ball.dy**2);
        let newSpeed = Math.min(currentSpeed + 0.5, 20);
        
        gameState.ball.dx = newSpeed * Math.cos(angleRad);
        gameState.ball.dy = newSpeed * Math.sin(angleRad);
        gameState.ball.x = gameState.paddle1.x + gameState.paddle1.width + gameState.ball.radius;
      }

      // --- ตรวจจับการชน ไม้ตี 2 (ฝั่งขวา) ---
      if (gameState.ball.x + gameState.ball.radius > gameState.paddle2.x &&
          gameState.ball.y > gameState.paddle2.y &&
          gameState.ball.y < gameState.paddle2.y + gameState.paddle2.height) {
        
        let collidePoint = (gameState.ball.y - (gameState.paddle2.y + gameState.paddle2.height / 2));
        collidePoint = collidePoint / (gameState.paddle2.height / 2);
        let angleRad = (Math.PI / 4) * collidePoint;
        let currentSpeed = Math.sqrt(gameState.ball.dx**2 + gameState.ball.dy**2);
        let newSpeed = Math.min(currentSpeed + 0.5, 20);
        
        gameState.ball.dx = -1 * newSpeed * Math.cos(angleRad);
        gameState.ball.dy = newSpeed * Math.sin(angleRad);
        gameState.ball.x = gameState.paddle2.x - gameState.ball.radius; 
      }

      // เช็คคะแนน
      if (gameState.ball.x - gameState.ball.radius < 0) {
        gameState.score2 += 1;
        checkWinCondition(io);
      } else if (gameState.ball.x + gameState.ball.radius > 800) {
        gameState.score1 += 1;
        checkWinCondition(io);
      }
    }

    io.emit('gameState', gameState);
  }, 16);
}

function checkWinCondition(io) {
  if (gameState.score1 >= WINNING_SCORE) {
    gameState.status = 'gameover';
    gameState.winner = 'Player 1 Wins!';
    startRestartTimer();
  } else if (gameState.score2 >= WINNING_SCORE) {
    gameState.status = 'gameover';
    gameState.winner = 'Player 2 Wins!';
    startRestartTimer();
  } else {
    resetBall();
  }
}

function startRestartTimer() {
  const { players } = require('./gameState');
  const connectedCount = Object.keys(players).length;

  setTimeout(() => {
    if (connectedCount >= 2) {
      gameState.score1 = 0;
      gameState.score2 = 0;
      gameState.winner = '';
      gameState.status = 'playing';
      resetBall();
    } else {
      resetGame();
    }
  }, 5000);
}

module.exports = { startGameLoop };
