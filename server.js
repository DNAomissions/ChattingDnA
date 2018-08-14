'use strict';

const express = require('express');
const socketIO = require('socket.io');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser')


const router = express.Router();

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');
const LOGIN = path.join(__dirname, 'login.html');
const MEMBER = path.join(__dirname, 'assets/json/member.json');

router.use(function (req,res,next) {
  console.log(req.method+" : "+req.url);
  next();
})
.use(bodyParser.urlencoded({ extended: false }))
.use(bodyParser.json());

router.delete("/json/member.json",function(req,res){
  if(fs.existsSync(MEMBER)){
    fs.unlink(MEMBER, function (err) {
      if(err){
        console.log('Error : '+err);
      }else{
        console.log('File member.json deleted!');
      }
    });
    res.send('Success Delete!');
  }else{
    console.log("File doestn't Exist!");
    res.send("File doestn't Exist!");
  }
});

router.put("/json/member.json",function(req,res){
  fs.writeFile(MEMBER, req.body.json, function (err) {
    if(err){
      console.log('Error : '+err);
    }else{
      console.log('File member.json Created!');
    }
    console.log('Saved!');
    res.send('Success Delete!');
  });
  console.log(req.body.json);
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
  .use(bodyParser.json())
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);
var countUser = 0;

var userLogin = [];

io.on('connection', (socket) => {
  socket.on('onlineUser',function(data){
    countUser++;
    userLogin.push(data.name);
    io.sockets.emit('userListActive',{user : userLogin});
    console.log("Online : "+data.name+" ("+data.status+")");
    io.sockets.emit('userActive',{userActive : countUser, status : 'Online',name : data.name});
    console.log('connected : '+countUser);
  });

  socket.on('offlineUser',function(data){
    countUser--;
    var index = userLogin.indexOf(data.name);
    userLogin.splice(index,1);
    io.sockets.emit('userListActive',{user : userLogin});
    console.log("Offline : "+data.name+" ("+data.status+")");
    io.sockets.emit('userActive',{userActive : countUser, status : 'Offline',name : data.name});
    console.log('connected : '+countUser);
  });

  socket.on('disconnect', () => {
  });

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
