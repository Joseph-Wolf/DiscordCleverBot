"use strict";

const Cleverbot = require('cleverbot');
const readline = require('readline');
let rl = readline.createInterface({input: process.stdin, output: process.stdout});

class cbot{
	constructor(){
		let self = this;
		self.bot =  null;
		self.token = null;
	}
	ask(message){
		let self = this;
		if(self.token) {
			self.bot.query(message.cleanContent.trim(), {
				cs: self.token
			})
			.then(function (response) {
				self.token = response.cs;
				if(response.output === undefined) { 
					message.reply('what do you mean?');
				} else {
					message.reply(response.output);
				}
			});
		} else {
			self.bot.query(message.cleanContent.trim())
			.then(function (response) {
				self.token = response.cs;
				if(response.output === undefined) { 
					message.reply('what do you mean?');
				} else {
					message.reply(response.output);
				}
			});
		}
	}
	authenticate(callback){
		let self = this;
		rl.question("CleverBot Key > ", function(answer) {
			try {
				self.bot =  new Cleverbot({
				  key: answer // Can be obtained at http://cleverbot.com/api 
				});
				callback(answer);
			} catch(err) {
				self.authenticate(callback); //Loop until valid
			}
		});
	}
}

module.exports = new cbot();