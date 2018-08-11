var formLogin = new Vue({
  el : '#formLogin',
  data : {
    email : "",
    password : ""
  },
  methods : {
    formValidate : function(){
      if(this.email == ''){
        swal('Warning!','Please insert Email!','warning')
      }else{
        if(this.password == ''){
          swal('Warning!','Please insert Password!','warning')
        }else{
          this.loginValidate()
        }
      }
    },
    loginValidate : function(){
      console.log(JSON.stringify(members.responseJSON));
      var resultEmail = this.searchEmail(this.email)

      console.log(resultEmail)
      if(resultEmail.length > 0){
        if(resultEmail[0].password == md5(this.password)){
          this.authLogin(resultEmail[0])
        }else{
          swal('Wrong!','Wrong password!','error')
        }
      }else{
        swal('Wrong!','Email not found!','error')
      }
    },
    searchEmail : function(email){
      return members.responseJSON.filter(
        function(members){
          return members.email == email
        }
      )
    },
    authLogin : function(member){
      if($('#remember').prop('checked') == true){
        Cookies.set("id",member.id,{expires:90})
        Cookies.set("name",member.name,{expires:90})
        Cookies.set("email",member.email,{expires:90})
        location.reload()
      }else{
        Cookies.set("id",member.id)
        Cookies.set("name",member.name)
        Cookies.set("email",member.email)
        location.reload()
      }
    }
  }
});
