var formRegister = new Vue({
  el : '#formRegister',
  data : {
    name : '',
    email : '',
    password : '',
    passwordConfirm : '',
    validateConfirm : false,
    validateEmailResult : false,
    members : this.members
  },
  mounted : function(){
    $.getJSON("../json/member.json",function(result){
      this.members = JSON.stringify(result)
    }).fail(function(){
      this.members = this.members
    });
    this.validateCPassword()
  },
  methods : {
    validateCPassword : function(){
      if(this.password.length >= 6){
        $('#cpassword-validate').attr('data-validate','Enter Confirm Password')
        if(this.password != this.passwordConfirm){
          $('#cpassword-validate').addClass('alert-validate').removeClass('alert-validate-success')
          this.validateConfirm = false
        }else{
          $('#cpassword-validate').removeClass('alert-validate').addClass('alert-validate-success')
          this.validateConfirm = true
        }
      }else{
        $('#cpassword-validate').attr('data-validate','Minimal 6 Character')
        $('#cpassword-validate').addClass('alert-validate').removeClass('alert-validate-success')
        this.validateConfirm = false
      }
    },
    registerMembers : function(){
      if(this.validateConfirm == true){
        var inputR = $('#formRegister .validate-input .input100');
        var check = true;

        for(var i=0; i<inputR.length; i++) {
            if(this.validate(inputR[i]) == false){
                this.showValidate(inputR[i]);
                check=false;
            }
        }

        if(check == true){
          if(this.validateEmailResult == true){
            var membersResult = [];
            if(this.members !=null ){
              if(this.members.responseJSON == null){
                membersResult = this.members
              }else{
                membersResult = this.members.responseJSON
              }
            }

            console.log(this.members);
            var id=0;
            var member;
            if(membersResult.length != null){
              id = membersResult.length;
            }

            if(id==0){
              member = [{
                id :id+1,
                email : this.email,
                name : this.name,
                password : md5(this.password),
                status : false,
                setting : {
                  ip : null,
                  status : null,
                  remember : false
                }
              }];

              auth = member[0];
              membersResult = member;
            }else{
              member = {
                id :id+1,
                email : this.email,
                name : this.name,
                password : md5(this.password),
                status : false,
                setting : {
                  ip : null,
                  status : null,
                  remember : false
                }
              };
              auth = member;
              membersResult[id] = member;
            }

            this.members = JSON.stringify(membersResult.replace("\\",''))
            $.ajax({
              type:'DELETE',
              url:'../json/member.json',
              success: function(result){
                $.ajax({
                  data : {
                    json : JSON.stringify(membersResult)
                  },
                  type:'PUT',
                  url:'../json/member.json/',
                  success: function(result){
                    Cookies.set("id-chatting-dna",auth.id)
                    Cookies.set("name-chatting-dna",auth.name)
                    Cookies.set("email-chatting-dna",auth.email)
                    Cookies.set('statusOnline-chatting-dna','New User Login');
                    location.reload()
                  }
                })
              }
            })
          }
        }
      }
    },
    validate : function (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    },
    validateEmail : function(){
      if(this.email.match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null){
        this.validateEmailResult = false
        $('#emailValidation').addClass('alert-validate');
      }else{
        this.validateEmailResult = true
        $('#emailValidation').removeClass('alert-validate');
      }
    },
    showValidate : function (input){
      var thisAlert = $(input).parent();

      $(thisAlert).addClass('alert-validate');
    },
    hideValidate : function (input){
      var thisAlert = $(input).parent();

      $(thisAlert).removeClass('alert-validate');
    }
  }
});

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
      if(members.responseJSON != null){
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
      }else{
        swal('Alert!','Please Sign Up!','warning')
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
      Cookies.set('statusOnline-chatting-dna','User Login');
      if($('#remember').prop('checked') == true){
        Cookies.set("id-chatting-dna",member.id,{expires:90})
        Cookies.set("name-chatting-dna",member.name,{expires:90})
        Cookies.set("email-chatting-dna",member.email,{expires:90})
        location.reload()
      }else{
        Cookies.set("id-chatting-dna",member.id)
        Cookies.set("name-chatting-dna",member.name)
        Cookies.set("email-chatting-dna",member.email)
        location.reload()
      }
    }
  }
});
