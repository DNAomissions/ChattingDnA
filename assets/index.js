var socket = io.connect();

function saveText(text, filename){
  var a = document.createElement('a');
  a.setAttribute('href', 'data:text/plain;charset=utf-u,'+encodeURIComponent(text));
  a.setAttribute('download', filename);
  a.click()
}

var navbarVue = new Vue({
  el : '#navbarVue',
  data : {
    usersOnline : 0
  }
});

var members = [];
// Vue Controller
var app = new Vue({
  el : '#app',
  data : {
    chatText : "",
    from : "",
    time : "",
    membersVue : [],
    usersOnline : 0
  },
  mounted : function(){
    this.from = Cookies.get('name-chatting-dna')
  },
  methods : {
    giveToSocket : function(){
      var d = new Date()
      var h = (d.getHours()<10?'0':'') + d.getHours()
      var m = (d.getMinutes()<10?'0':'') + d.getMinutes()
      var s = (d.getSeconds()<10?'0':'') + d.getSeconds()
      if(this.from == ''){
        this.from = 'Unknown'
      }
      this.time = h+':'+m+':'+s
      socket.emit('chat message',{
        message : this.chatText,
        from : this.from,
        time : this.time,
        ip : null
      })
      this.chatText = ""
    },
    newline: function(){
      this.chatText = `{this.chatText}\n`
    },
    addTab: function(){
      this.chatText = this.chatText+`\t`
    },
    logoutAuth : function(){
      Cookies.remove("id-chatting-dna")
      Cookies.remove("name-chatting-dna")
      Cookies.remove("email-chatting-dna")
      location.reload()
    }
  }
});

function onlineUser(){
  socket.emit('onlineUser',{
    name : Cookies.get("name-chatting-dna"),
    status : Cookies.get('statusOnline-chatting-dna')
  });
  Cookies.remove('statusOnline');
};

$(window).on('beforeunload',function(){
  var d = new Date();
  var h = (d.getHours()<10?'0':'') + d.getHours();
  var m = (d.getMinutes()<10?'0':'') + d.getMinutes();
  var s = (d.getSeconds()<10?'0':'') + d.getSeconds();
  var time = h+':'+m+':'+s;
  if(Cookies.get('statusDocument-chatting-dna') == 'Logout'){
    socket.emit('offlineUser',{
      name : Cookies.get('name-chatting-dna'),
      status : 'Logout',
      time : time
    });
    Cookies.remove('name-chatting-dna');
    Cookies.remove('statusDocument-chatting-dna')
  }else{
    socket.emit('offlineUser',{
      name : Cookies.get('name-chatting-dna'),
      status : 'Close/Refresh',
      time : time
    });
    Cookies.set('statusOnline-chatting-dna','Re-Login');
  }
});

$(document).ready(function(){
  socket.on('chat message', function(msg){
    if(msg.from == Cookies.get("name-chatting-dna")){
      $('#chatResult').append(`<li class="wowload fadeIn row justify-content-end"><div class="speech-bubble-right"><pre style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';font-size: 1rem;font-weight: 400;  line-height: 1.5;color: #212529;text-align: left;white-space: pre-wrap;word-break: keep-all;"><span class="sender-chat">Me</span><br><span class="divider-chat-bubble"></span><p class="message-chat">`+msg.message+`</p><span class="time-chat" style="float:right;">`+msg.time+`</span></pre></div></li>`);
    }else{
      $('#chatResult').append(`<li class="wowload fadeIn row justify-content-start"><div class="speech-bubble-left"><pre style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';font-size: 1rem;font-weight: 400;  line-height: 1.5;color: #212529;text-align: left;white-space: pre-wrap;word-break: keep-all;"><span class="sender-chat">`+msg.from+`</span><br><span class="divider-chat-bubble"></span><p class="message-chat">`+msg.message+`</p><span class="time-chat" style="float:left;">`+msg.time+`</span></pre></div></li>`);
      newMessageSound();
    }
    window.scrollTo(0, document.body.scrollHeight);
  });

  socket.on('userListActive',function(data){
    app.membersVue = data.user
  });

  socket.on('userActive',function(data){
    if(data.status == 'Online'){
      if(data.name != Cookies.get('name-chatting-dna')){
        onlineSound();
      }
    }

    if(data.status == 'Offline'){
      offlineSound();
    }

    app.usersOnline = data.userActive;
  });
});

// Notification Sound

function playSound(url){
  var audio = document.createElement('audio');
  audio.style.display = "none";
  audio.src = url;
  audio.autoplay = true;
  audio.onended = function(){
    audio.remove() //Remove when played.
  };
  document.body.appendChild(audio);
}

function onlineSound(){
  playSound('notif-sound/open-ended.ogg');
}

function offlineSound(){
  playSound('notif-sound/case-closed.ogg');
}

function newMessageSound(){
  playSound('notif-sound/cheerful.ogg');
}
