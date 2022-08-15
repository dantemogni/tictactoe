const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const activeUsers = new Map();

io.on('connection', (socket) => {
  console.log("Made socket connection");

  socket.on("code", function (data) {
    userData = {
      'id': socket.id,
      'code': data,
    }

    // users = new Map();
    // users.set(socket.id, data)
    socket.me = data;
    activeUsers.set(data, socket.id)
    socket.emit("new user", [...activeUsers]);

    console.log(activeUsers)
  });

  socket.on("multiplayerRequest", function(data) {
    if (data.solicitedGame == socket.me) {
      socket.emit("error", "You can't play with yourself");
      return
    }

    if (activeUsers.has(data.solicitedGame)){
      console.log("match found")
      socket.data.guessSocketId = activeUsers.get(data.solicitedGame);
      socket.guessSocketId = activeUsers.get(data.solicitedGame)
      // comunico al otro socket que hay un match
      io.sockets.sockets.get(socket.guessSocketId).emit("match", {
        'my': data.solicitedGame, 
        'third': socket.me, 
        'thirdSocketId': socket.id, 
        'myTurn': false,
      });

      socket.emit("match", {
        'my': socket.me, 
        'third': data.solicitedGame, 
        'thirdSocketId': data.socketId, 
        'myTurn': true, 
    });
    } else {
      socket.emit("no match", data.solicitedGame);
    }
  });

  socket.on("game", (data) => {    

    oldThirdMultiplayerCode = data.guessSocketId
    data.guessSocketId = data.meSocketId
    data.meSocketId = oldThirdMultiplayerCode
    data.myTurn = !data.myTurn

    io.sockets.sockets.get(oldThirdMultiplayerCode).emit("game", data);
  });

  socket.on("jump to", (data) => {
    io.sockets.sockets.get(socket.guessSocketId).emit("jump to", data);
  });

  socket.on("disconnect", (data) => {
    activeUsers.delete(socket.me);
    console.log(data)
    console.log(socket.id)
    console.log(socket.guessSocketId)
    console.log(socket.data.guessSocketId)
    
    if (socket.data.guessSocketId) {
      io.sockets.sockets.get(socket.data.guessSocketId).emit("user disconnected", socket.me);
    }
    console.log(activeUsers)
  });
});


server.listen(2000, () => {
  console.log('listening on *:2000');
});