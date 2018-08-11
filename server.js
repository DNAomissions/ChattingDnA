'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('connected : '+socket.handshake.query['name']);
  socket.on('disconnect', () => console.log('Client disconnected'));

  socket.on('chat message', function(msg){
    io.emit('chat message', {
      from : msg.from,
      message : msg.message,
      time : msg.time,
      ip : msg.ip
    });
  });
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
