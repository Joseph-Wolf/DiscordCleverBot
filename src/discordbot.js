"use strict";

const Discord = require('discord.js');

module.exports = class discord{
	constructor(){
		let self = this;
		self.client = new Discord.Client();
		self.client.on('ready', () => { //display message to the console when up and running
			console.log('I am ready!');
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
	registerMessage(expression, callback){
		let self = this;
		self.client.on('message', message => {
			let content = message.cleanContent.trim() //trim any excess spaces and make it a happy string
			let authorIsNotBot = message.author.id !== self.client.user.id; //is the author the bot? don't want infinite loops
			let botIsMentioned = message.isMentioned(self.client.user); //is the bot mentioned?
			if (authorIsNotBot && botIsMentioned && expression.test(content)) { //send cleaned message to cleverbot
				return callback(null, message); //Execute the callback with the message
			}
			return; //Don't return the callback or else it will get used
		});
	}
}