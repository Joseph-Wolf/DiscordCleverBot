"use strict";

const Discord = require('discord.js');
const getConsoleInput = require('./util/getConsoleInput.js');

class discord{
	constructor(){
		let self = this;
		self.client = new Discord.Client();
		self.messageRegistrations = [];
		self.client.on('ready', () => { //display message to the console when up and running
			self.client.on('message', message => { //Handle messages directed to bot
				let content = message.cleanContent.trim() //trim any excess spaces and make it a happy string
				let authorIsNotBot = message.author.id !== self.client.user.id; //is the author the bot? don't want infinite loops
				let botIsMentioned = message.isMentioned(self.client.user); //is the bot mentioned?
				if (authorIsNotBot && botIsMentioned) { //send cleaned message to cleverbot
					for(var item of self.messageRegistrations){ //loop through each of the registered messages
						if(item.expression.test(content)){ //if the content of the message matches the expression
					    	item.callback(message); //Execute the callback with the message
					    	break;
					    }
					}
				}
			});
			console.log('I am ready!');
		});
	}
	authenticate(value, callback){
		let self = this;
		self.client.login(value).then(callback, function(){
			getConsoleInput('Discord Bot Key > ', function(answer) {
				self.authenticate(answer, callback); //Loop until valid
			});
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
			//TODO: is there a way to remove the event instead of using blank function?
			self.client.on('guildMemberAdd', function(){}); //Message to display when adding a member
		}
	}
	registerMessage(exp, cb){
		let self = this;
		self.messageRegistrations.push({expression: exp, callback: cb});
	}
}

module.exports = new discord();