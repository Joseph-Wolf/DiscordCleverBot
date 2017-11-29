"use strict";

const Discord = require('discord.js');

module.exports = class discord{
	constructor(){
		let self = this;
		self.client = new Discord.Client();
		self.client.on('ready', () => { //display message to the console when up and running
			console.info('I am ready!');
		});
		self.registeredMessages = [];
		self.DBKey = 'DiscordToken';

		self.client.on('message', message => {
			let content = message.cleanContent.trim() //trim any excess spaces and make it a happy string
			let authorIsNotBot = !message.author.bot; //is the author the bot? don't want infinite loops
			let botIsMentioned = message.isMentioned(self.client.user); //is the bot mentioned?
			if (authorIsNotBot && botIsMentioned) { //send cleaned message to cleverbot
				for(let index = 0; index < self.registeredMessages.length; index++){
					let expression = self.registeredMessages[index].expression;
					let callback = self.registeredMessages[index].callback;
					let additionalParams = self.registeredMessages[index].additionalParams;
					if(expression.test(content)){
						additionalParams.text = content;
						additionalParams.users = [];
						message.mentions.users.filter(obj => !obj.bot).every(function(user){
							return additionalParams.users.push({discordId: user.id, name: user.toString()});
						});
						message.mentions.roles.map(x => x.members).every(function(userCollection){
							userCollection.filter(obj => !obj.bot).every(function(user){
								return additionalParams.users.push({discordId: user.id, name: user.toString()}); 
							});
						});
						additionalParams.isAdmin = message.member.hasPermission('ADMINISTRATOR');
						return callback(null, function(err, reply){
							if(err){
								return message.reply(err); //Should be sanatized error message
							}
							return message.reply(reply);
						}, additionalParams); //Execute the callback with the message
					}
				}
			}
			return; //Don't return the callback or else it will get used
		});
	}
	authenticate(value, callback){
		let self = this;
		self.client.login(value).then(function(accepted){
			return callback(null, accepted);
		}).catch(function(err){
			return callback(err);
		});
	}
	welcomeUsers(enable, message){
		let self = this;
		if(message === null){
			message = `Welcome to ${guild.name} ${member.username}!!!`;
		}
		if(enable){
			self.client.on('guildMemberAdd', (guild, member) =>  guild.defaultChannel.sendMessage(message)); //Message to display when adding a member
		} else {
			self.client.removeAllListeners('guildMemberAdd'); //Remove any existing welcome messages
		}
	}
	registerMessage(expression, callback, additionalParams){
		let self = this;
		if(additionalParams === null || additionalParams === undefined){
			additionalParams = {};
		}
		self.registeredMessages.push({expression: expression, callback: callback, additionalParams});
	}
	clearMessages(){
		let self = this;
		self.registeredMessages = [];
	}
}