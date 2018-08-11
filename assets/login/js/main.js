
(function ($) {
    "use strict";


    /*==================================================================
    [ Focus input ]*/
    $('.input100').each(function(){
        $(this).on('blur', function(){
            if($(this).val().trim() != "") {
                $(this).addClass('has-val');
            }
            else {
                $(this).removeClass('has-val');
            }
        })
    })


    /*==================================================================
    [ Validate ]*/
    var inputL = $('#formLogin .validate-input .input100');
    $('#formLogin').on('submit',function(){
        var check = true;

        for(var i=0; i<inputL.length; i++) {
            if(validate(inputL[i]) == false){
                showValidate(inputL[i]);
                check=false;
            }
        }
        return check;
    });

    var inputR = $('#formRegister .validate-input .input100');
    $('#formRegister').on('submit',function(){
        var check = true;

        for(var i=0; i<inputR.length; i++) {
            if(validate(inputR[i]) == false){
                showValidate(inputR[i]);
                check=false;
            }
        }
        return check;
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
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
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }

    /*==================================================================
    [ Show pass ]*/
    var showPass = 0;
    $('.btn-show-pass').on('click', function(){
        if(showPass == 0) {
            $(this).next('input').attr('type','text');
            $(this).find('i').removeClass('fa-eye');
            $(this).find('i').addClass('fa-eye-slash');
            showPass = 1;
        }
        else {
            $(this).next('input').attr('type','password');
            $(this).find('i').addClass('fa-eye');
            $(this).find('i').removeClass('fa-eye-slash');
            showPass = 0;
        }
    });


})(jQuery);
var showPass = 0;
function changeDisplay(object){
  if(showPass == 0) {
      $(object).next('input').attr('type','text');
      $(object).find('i').removeClass('fa-eye');
      $(object).find('i').addClass('fa-eye-slash');
      showPass = 1;
  }
  else {
      $(object).next('input').attr('type','password');
      $(object).find('i').addClass('fa-eye');
      $(object).find('i').removeClass('fa-eye-slash');
      showPass = 0;
  }
}
