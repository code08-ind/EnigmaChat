var path = require('path');
var http = require('http');
var express = require('express');
var socketio = require('socket.io');
var formatMessage = require('./utils/messages');
var {userJoin ,getCurrentUser ,userLeaves ,getRoomUsers} = require('./utils/users');
var app = express();
var server = http.createServer(app);
var io = socketio(server);

var admin = 'EnigmaChat ChatBot'

//set static public folder
app.use(express.static(path.join(__dirname + '/public')));


//Run when client connects
io.on('connection', socket => {
	
	socket.on('JoinRoom',({username , room}) => {
		
		const user = userJoin(socket.id, username , room);
		
		socket.join(user.room);
		
		//to tell the user that he has logged in to that user
	   socket.emit('message', formatMessage(admin,'Welcome To The EnigmaChat !'));
	
	//to tell others that the new user has logged in
	   socket.broadcast.to(user.room).emit('message', formatMessage(admin, `${user.username} Has Entered The Room !`));
		
	   io.to(user.room).emit('roomUsers',{
		   room:user.room,
		   users:getRoomUsers(user.room)
	   });
	
	});
	
	//Listen for the chat message
	socket.on('chatMessage', msg => {
		
		const user = getCurrentUser(socket.id);
		
		io.to(user.room).emit('message', formatMessage(user.username, msg));
	});
	
	//when the particular user has left the chat and to tell the others that the user has left
	socket.on('disconnect', () => {
		
		const user = userLeaves(socket.id);
		
		if(user){
		   io.to(user.room).emit('message', formatMessage(admin,`${user.username} Has Left The Chat!`)
	      );	
		   io.to(user.room).emit('roomUsers',{
		   room:user.room,
		   users:getRoomUsers(user.room),
	   });
		}
	});
});

//for the opening of the server 
var port = process.env.PORT || 3000;
server.listen(port,function(){
	console.log('The EnigmaChat Has Started !');
});