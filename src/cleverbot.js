"use strict";

const cleverbot = require('better-cleverbot-io');
const getRandomInt = require('./util/getRandomInt.js');

module.exports = class cbot{
	constructor(){
		let self = this;
		self.bot = null;
		self.valid = false;
		self.token = getRandomInt(0, Number.MAX_SAFE_INTEGER).toString();
		self.isBroken = false;
		self.DBKey = 'CleverbotToken';
	}
	ask(message, callback){
		let self = this;
		if(self.valid){
			return self.bot.ask(message).then(response => {
				if(response === undefined || response === null){ //If response is no good then ask again
					return callback('What do you mean?');
				}
				cleverbot.isBroken = false;
				return callback(null, response);
			}).catch(err => {
				console.error(err);
				if(!self.isBroken){
					self.isBroken = true;
					return callback('I am broken... (XuX)');
				}
				return; //If already replied with broken message don't keep replying
			});
		}
		return callback('Please set up credentials for Cleverbot feature.');
	}
	authenticate(doc, callback){
		let self = this;
		self.bot = new cleverbot({user: doc.user, key: doc.key, nick: self.token});
		self.bot.create().then(() => {
			self.valid = true;
			return callback(null, doc);
		}).catch(err => {
			self.valid = false;
			return callback(err);
		});
	}
}