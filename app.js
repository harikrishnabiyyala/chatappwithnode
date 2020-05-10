const express = require('express')
const app = express()

var users = [];


// set the template engine ejs 
app.set('view engine','ejs')

//mddlewars

app.use(express.static('public'))

//routes 
app.get('/',(req,res)=>{

   res.render('index')

})

//listen on port 3000
server = app.listen(3000)

//socket.io instantiation
const io = require("socket.io")(server)


//listen on every connection
io.on('connection', (socket) => {
	//console.log('New user connected')

	//default username
	//socket.username = "Anonymous"

    //listen on change_username
    socket.on('change_username', (data) => {
        socket.username = data.username
     //   console.log("previouse name: "+data.prevname);
      //  console.log("present name: "+data.username);
      //  console.log(users);
        for(var i=0; i<users.length; i++) {
            if(users[i] == data.prevname) {
                 users.splice(i,1);
                break;
            }
        }
        users.push(data.username);
      //  console.log(users);
        updateClients();
    })

    //listen on new_message
    socket.on('new_message', (data) => {
        //broadcast the new message
        io.sockets.emit('new_message', {message : data.message, username : socket.username});
      //  console.log(socket.username)
    })

    //listen on typing
    socket.on('typing', (data) => {
    	socket.broadcast.emit('typing', {username : socket.username})
    })


    socket.on('adduser', function (user) {
        socket.user = user;
        socket.username = user 
      //  console.log(user)
        users.push(user);
        updateClients();
    });

    socket.on('disconnect', function () {
        for(var i=0; i<users.length; i++) {
            if(users[i] == socket.user) {
                users.splice(i,1);
            }
        }
        updateClients(); 
    });




    function updateClients() {
        io.sockets.emit('update', users);
    }


})