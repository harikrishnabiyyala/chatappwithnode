$(function(){

    var myUsername = "Anonymous"
    //make connection
    var socket = io();  //.connect('http://localhost:3000')

    //buttons and inputs 
    var message = $("#message")
    var username = $("#username")
    var send_message = $("#send_message")
    var send_username = $("#send_username")
    var chatroom = $("#chatroom")
    var feedback = $("#feedback")
    
    socket.on('connect', function (){
        var t=prompt("What's your name?").toUpperCase();
        socket.emit('adduser', t);
        document.getElementsByClassName('name')[0].innerHTML = t;
        myUsername=t;
        
    });

    var userList = [];
    //for updating the names......
    socket.on('update', function (users){
        userList = users;
        $('#user').empty();
        for(var i=0; i<userList.length; i++) {
            $('#user').append("<h1>" + userList[i] + "</h1>"); 
        }
    });
   
    //Emit message
    send_message.click(function(){

        if (message.val()!=""){
        socket.emit('new_message', {message : message.val()})
        }
        $("#message").val("");
    
    })

    //Listen on new_message
    socket.on("new_message", (data) => {
        if (myUsername == data.username){
            chatroom.append('       <div class="card bg-primary rounded w-75 z-depth-0 float-right  mb-1 message-text"><div class="card-body p-2"><p class="card-text black-text">' + data.message + '</p></div></div>')
        } else {
            chatroom.append('       <div class="card bg-light rounded w-75 z-depth-0 mb-1 message-text"><div class="card-body p-2"><p class="card-text black-text">' + data.message + '</p><p>--:By '+data.username+'</p></div></div>')
        }
    })

    //Emit typing
    message.bind("keypress", () => {
        socket.emit('typing')
    })

    //Listen on typing
    socket.on('typing', (data) => {
        feedback.html("<p><i>" + data.username + " is typing a message... " + "</i></p>")
        setTimeout(function(){ feedback.html("") }, 1000);

    })

    //Emit a username
    send_username.click(function(){
    
        socket.emit('change_username', {username : username.val(),prevname:myUsername})
        alert('usename changed to:  '+ username.val());
        document.getElementsByClassName('name')[0].innerHTML = username.val().toUpperCase();
        myUsername = username.val();
    })




});