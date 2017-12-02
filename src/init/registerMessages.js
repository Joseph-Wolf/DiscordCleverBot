"use strict";

module.exports = function(client, messages, callback){
	console.log(client.removeAllListeners);
	client.removeAllListeners('message'); //Starts with a clean message event
	client.on('message', message => {
		let content = message.cleanContent.trim() //trim any excess spaces and make it a happy string
		let authorIsNotBot = !message.author.bot; //is the author the bot? don't want infinite loops
		let botIsMentioned = message.isMentioned(client.user); //is the bot mentioned?
		if (authorIsNotBot && botIsMentioned) { //send cleaned message to cleverbot
			for(let index = 0; index < messages.length; index++){
				let expression = messages[index].expression;
				let callback = messages[index].callback;
				let additionalParams = messages[index].additionalParams;
				if(expression.test(content)){
					additionalParams = (additionalParams || {});
					additionalParams.text = content;
					additionalParams.users = [];
					message.mentions.users.filter(obj => !obj.bot).every(function(user){ //Populate mentioned users
						return additionalParams.users.push({discordId: user.id, name: user.toString()});
					});
					message.mentions.roles.map(x => x.members).every(function(userCollection){ //Parse mentioned roles into users
						userCollection.filter(obj => !obj.bot).every(function(user){
							return additionalParams.users.push({discordId: user.id, name: user.toString()}); 
						});
					});
					additionalParams.isAdmin = message.member.hasPermission('ADMINISTRATOR');
					return callback(null, additionalParams, function(err, reply){
						if(err){
							return message.reply(err); //Should be sanatized error message
						}
						return message.reply(reply);
					}); //Execute the callback with the message
				}
			}
		}
		return; //Don't return the callback or else it will get used
	});
	if(callback){
		return callback(null);
	}
	return;
}