const { gameState, players, resetGame } = require('./gameState');

function initSocketHandlers(io) {
  io.on('connection', (socket) => {
    let connectedCount = Object.keys(players).length;
    console.log('ผู้เล่นเข้าสู่เซิร์ฟเวอร์: ', socket.id);
    
    if (connectedCount === 0) {
      players[socket.id] = 'player1';
      socket.emit('playerRole', 'player1');
    } else if (connectedCount === 1) {
      players[socket.id] = 'player2';
      socket.emit('playerRole', 'player2');
    } else {
      socket.emit('playerRole', 'spectator');
    }

    // --- เช็คว่าผู้เล่นครบ 2 คนให้เริ่มเกม ---
    if (Object.keys(players).length >= 2 && gameState.status === 'waiting') {
      gameState.status = 'playing';
    }

    socket.on('movePaddle', (data) => {
      let role = players[socket.id];
      if (role === 'player1') gameState.paddle1.y = data.y;
      else if (role === 'player2') gameState.paddle2.y = data.y;
    });

    socket.on('disconnect', () => {
      console.log('ผู้เล่นออก: ', socket.id);
      if (players[socket.id]) {
        delete players[socket.id];
        
        // --- ถ้ามีคนออก ให้รีเซ็ตเกมกลับไปสถานะรอ ---
        if (Object.keys(players).length < 2) {
          resetGame();
        }
      }
    });
  });
}

module.exports = { initSocketHandlers };
