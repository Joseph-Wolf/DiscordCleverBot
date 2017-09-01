"use strict";

const cleverbot = require("cleverbot.io");
const getConsoleInput = require('./util/getConsoleInput.js');
const getRandomInt = require('./util/getRandomInt.js');

class cbot{
	constructor(user, key){
		let self = this;
		self.bot = null;
		self.valid = false;
		self.token = getRandomInt(1, 99999990).toString();
	}
	ask(message, callback){
		let self = this;
		if(this.valid){
			self.bot.create(function(err, response){
				if(!err){
					self.bot.ask(message, function(err, response){
						if(!err){
							if(response === undefined){
								response = 'What do you mean?';
							}
							callback(response);
						}
					});
				}
			});
		} else {
			callback('Please set up credentials for Cleverbot feature.');
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
				self.valid = true;
				callback(user, key);
			}
		});

		self.bot.setNick(self.token);
	}
}

module.exports = new cbot();