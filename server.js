'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

var router = express.Router();

const PORT = 3000;
const INDEX = path.join(__dirname, 'index.html');
const LOGIN = path.join(__dirname, 'login.html');
router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
  res.sendFile(INDEX);
});

router.get("/login",function(req,res){
  res.sendFile(LOGIN);
});

const server = express()
  .use(express.static(path.join(__dirname,'assets')))
  .use('/',router)
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
