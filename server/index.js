const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const activeUsers = new Set();

io.on('connection', (socket) => {
  console.log("Made socket connection");

  socket.on("code", (data) => { 
    console.log(data)
  })

  socket.on("code", function (data) {
    socket.userCode = data;
    activeUsers.add(data);
    io.emit("new user", [...activeUsers]);
  });

  socket.on("disconnect", () => {
    activeUsers.delete(socket.userCode);
    io.emit("user disconnected", socket.userId);
  });
});


server.listen(2000, () => {
  console.log('listening on *:2000');
});