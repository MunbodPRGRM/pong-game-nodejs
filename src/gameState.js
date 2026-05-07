const WINNING_SCORE = 5;

let gameState = {
  paddle1: { x: 10, y: 250, width: 15, height: 100 },
  paddle2: { x: 775, y: 250, width: 15, height: 100 },
  ball: { x: 400, y: 300, radius: 10, dx: 5, dy: 5 },
  score1: 0,
  score2: 0,
  status: 'waiting', 
  winner: ''
};

let players = {}; // เก็บสถานะว่า Socket ID ไหนเป็น Player อะไร

function resetGame() {
  gameState.score1 = 0;
  gameState.score2 = 0;
  gameState.ball.x = 400;
  gameState.ball.y = 300;
  gameState.paddle1.y = 250;
  gameState.paddle2.y = 250;
  gameState.status = 'waiting';
}

function resetBall() {
  gameState.ball.x = 400;
  gameState.ball.y = 300;
  gameState.ball.dx *= -1; // สลับฝั่งคนเสิร์ฟ
}

module.exports = {
  gameState,
  players,
  WINNING_SCORE,
  resetGame,
  resetBall
};
