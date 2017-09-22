"use strict";

const Discord = require('discord.js');
const User = require('./db/class/user.js');

module.exports = class discord{
	constructor(){
		let self = this;
		self.client = new Discord.Client();
		self.client.on('ready', () => { //display message to the console when up and running
			console.log('I am ready!');
		});
		self.DBKey = 'DiscordToken';
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
		self.client.on('message', message => {
			let content = message.cleanContent.trim() //trim any excess spaces and make it a happy string
			let authorIsNotBot = message.author.id !== self.client.user.id; //is the author the bot? don't want infinite loops
			let botIsMentioned = message.isMentioned(self.client.user); //is the bot mentioned?
			if (authorIsNotBot && botIsMentioned && expression.test(content)) { //send cleaned message to cleverbot
				additionalParams.text = message.cleanContent.trim();
				additionalParams.user = new User({name: 'dummy'}); //TODO: pass users to the callback incase they are needed
				additionalParams.isAdmin = true; //TODO: pass if the requesting user is an admin or not
				return callback(null, function(err, reply){
					if(err){
						return message.reply(err); //Should be sanatized error message
					}
					return message.reply(reply);
				}, additionalParams); //Execute the callback with the message
			}
			return; //Don't return the callback or else it will get used
		});
	}
}