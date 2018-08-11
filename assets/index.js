var socket = io.connect'https://'+window.location.hostname+':3000',{ query: "name="+Cookies.get("name") });

$(document).ready(function(){
  socket.on('chat message', function(msg){
    if(msg.from == Cookies.get("name")){
      $('#chatResult').append(`<li class="wowload fadeIn speech-bubble-right"><pre style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';font-size: 1rem;font-weight: 400;  line-height: 1.5;color: #212529;text-align: left;"><span class="sender-chat">`+msg.from+`</span><br><span class="divider-chat-bubble"></span><p class="message-chat">`+msg.message+`</p><span class="time-chat">`+msg.time+`</span></pre></li>`);
    }else{
      $('#chatResult').append(`<li class="wowload fadeIn speech-bubble-left"><pre style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';font-size: 1rem;font-weight: 400;  line-height: 1.5;color: #212529;text-align: left;"><span class="sender-chat">`+msg.from+`</span><br><span class="divider-chat-bubble"></span><p class="message-chat">`+msg.message+`</p><span class="time-chat">`+msg.time+`</span></pre></li>`);
    }
    window.scrollTo(0, document.body.scrollHeight);
  });
});

var memberActive = Cookies.get();

// Vue Controller
new Vue({
  el : '#app',
  data : {
    chatText : "",
    from : "",
    time : ""
  },
  mounted : function(){
    this.from = memberActive.name
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
      Cookies.remove("id")
      Cookies.remove("name")
      Cookies.remove("email")
      location.reload()
    }
  }
});
