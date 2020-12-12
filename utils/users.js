const users = [];

//join user to chat
function userJoin(id, username, room){
	const user = {id, username , room};
	
	users.push(user);
	return user;
}

//get user from memory
function getCurrentUser(id){
	return users.find(user => user.id === id);
}

//user leaves
function userLeaves(id){
	const index = users.findIndex(user => user.id === id);
	
	if(index !== -1){
		return users.splice(index , 1)[0];//returning only the user
	}
}

//get room users
function getRoomUsers(room){
	return users.filter(user => user.room === room);
}

module.exports = {
	userJoin,
	getCurrentUser,
	userLeaves,
	getRoomUsers
};