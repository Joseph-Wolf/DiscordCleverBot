"use strict";

const Discord = require('discord.js');
const getConsoleInput = require('./util/getConsoleInput.js');

class discord{
	constructor(){
		let self = this;
		self.client = new Discord.Client();

		self.client.on('ready', () => { //display message to the console when up and running
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
}

module.exports = new discord();