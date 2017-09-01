"use strict";

const cleverbot = require("cleverbot.io");
const getConsoleInput = require('./util/getConsoleInput.js');
const getRandomInt = require('./util/getRandomInt.js');

class cbot{
	constructor(user, key){
		let self = this;
		self.bot = null;
		self.valid = false;
		self.token = getRandomInt(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER).toString();
		self.isBroken = false;
	}
	ask(message){
		let self = this;
		if(self.valid){
			self.bot.create(function(err, response){
				if(!err){
					self.bot.ask(message.cleanContent.trim(), function(err, response){
						console.log('here');
						console.log(err);
						if(!err){
							self.isBroken = false; //Reset broken indicator
							if(response === undefined){ //Reply might have been missed
								response = 'What do you mean?'; //Ask for clarification to try again
							}
						} else {
							if(!self.isBroken) { //don't want to spam the chat
								response = 'I am broken... (XuX)';
							}
							self.isBroken = true;
						}
						message.reply(response);
					});
				}
			});
		} else {
			message.reply('Please set up credentials for Cleverbot feature.');
		}
	}
	authenticate(user, key, callback){
		let self = this;
		self.bot = new cleverbot(user, key);
		self.bot.create(function(err, response){
			if(err){
				console.log(err);
				self.valid = false;
			} else {
				callback(user, key);
				self.valid = true;
			}
		});

		self.bot.setNick(self.token);
	}
	authenticateWithPrompt(callback){
		let self = this;
		getConsoleInput('Cleverbot.io User > ', function(user) {
			getConsoleInput('Cleverbot.io Key > ', function(key) {
				self.bot = new cleverbot(user, key);
				self.bot.create(function(err, response){
					if(err){
						console.log(err);
						self.valid = false;
					} else {
						callback(user, key);
						self.valid = true;
					}
				});

				self.bot.setNick(self.token);
			});
		});
	}
}

module.exports = new cbot();