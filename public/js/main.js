const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.querySelector('#room-name');
const userList = document.querySelector('#users');

//get username and room from url
const{username ,room} = Qs.parse(location.search ,{
	ignoreQueryPrefix:true
});

const socket = io();

//join the chast room
socket.emit('JoinRoom',{username, room});

//get room and users
socket.on('roomUsers',({room , users}) => {
	outputRoomName(room);
	outputUsers(users);
});

//message from the server
socket.on('message', message => {
	console.log(message);
	outputMessage(message);
	
	//scroll down
	chatMessages.scrollTop = chatMessages.scrollHeight;
});

//message submition

chatForm.addEventListener('submit', (e)=>{
	e.preventDefault();
	
	//taking the message
	const msg = e.target.elements.msg.value;
	
	//emiting the text message
	socket.emit('chatMessage',msg);
	
	//clear the message in the chat mesage area
	e.target.elements.msg.value = '';
	e.target.elements.msg.focus();
});

//output message from dom
function outputMessage(message){
	const div = document.createElement('div');
	div.classList.add('message');
	div.innerHTML=`<p class="meta">${message.username} <span>${message.time}</span></p>
						<p class="text">
							${message.text}
						</p>`;
	document.querySelector('.chat-messages').appendChild(div);
}

//add room name to DOM
function outputRoomName(room){
	roomName.innerText = room;
}

//add users to DOM
function outputUsers(users){
	userList.innerHTML = `
      ${users.map(user => `<li> ${user.username} </li>`).join('')}
`;
}
