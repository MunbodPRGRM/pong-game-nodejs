const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const { initSocketHandlers } = require('./socketHandlers');
const { startGameLoop } = require('./gameLoop');

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: { 
    origin: "*", // เปลี่ยนจาก "http://localhost:4200" เป็น "*" เพื่อให้เข้าได้จากทุกเว็บชั่วคราว
    methods: ["GET", "POST"] 
  }
});

// เริ่มต้นจัดการ Socket Events
initSocketHandlers(io);

// เริ่มต้น Game Loop
startGameLoop(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
