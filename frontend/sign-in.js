

$(document).ready(function(e) {   
    sign_in_submit();
 });



 function sign_in_submit(){
    $("#sign-in").submit(function (e) {
        e.preventDefault();
        let username = $("#username").val();
        let password = $("#password").val();
        sign_in_req(username,password);
    });
 }

 function sign_in_req(username,password){
     let uri = 'http://localhost:3001/api/login';
     let params = {
        username:username,
        password:password 
     }; 
     let param_serial = $.param(params);
     let url = uri + "?" + param_serial;

     //Make request to the api
     $.get(url, function(res) {
        if(!res.posted){
            let message = res.message;
            $("#error > #error-p").text(message);
        }else{
            $.cookie("username", username, 1);
            let global = new Global();
            window.location.href = global._getPath("/find-img.html");
        }
    });
 }