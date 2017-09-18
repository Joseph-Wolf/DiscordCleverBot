"use strict";

const cleverbot = require("cleverbot.io");
const getRandomInt = require('./util/getRandomInt.js');

module.exports = class cbot{
	constructor(){
		let self = this;
		self.bot = null;
		self.valid = false;
		self.token = getRandomInt(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER).toString();
		self.isBroken = false;
	}
	ask(message, callback){
		let self = this;
		if(self.valid){
			self.bot.create(function(err, response){
				if(err){
					return callback(err);
				}
				return self.bot.ask(message, function(err, response){
					if(err){
						if(!cleverbot.isBroken){
							cleverbot.isBroken = true;
							return callback(null, 'I am broken... (XuX)');
						}
						return callback(err); //If already replied with broken message don't keep replying
					}
					if(response === undefined || response === null){ //If response is no good then ask again
						return callback(null, 'What do you mean?');
					}
					cleverbot.isBroken = false;
					return callback(null, response);
				});
			});
		} else {
			return callback(null, 'Please set up credentials for Cleverbot feature.');
		}
	}
	authenticate(doc, callback){
		let self = this;
		self.bot = new cleverbot(doc.user, doc.key);
		self.bot.create(function(err, response){
			if(err){ //will return false if there was an error
				self.valid = false;
				return callback(err);
			}
			self.valid = true;
			self.bot.setNick(self.token); //set the nickname of the session
			return callback(null, {user: user, key: key});
		});
	}
}