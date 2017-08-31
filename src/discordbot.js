"use strict";

const Discord = require('discord.js');
const readline = require('readline');
let rl = readline.createInterface({input: process.stdin, output: process.stdout});

class discord{
	constructor(){
		let self = this;
		self.client = new Discord.Client();

		self.client.on('ready', () => { //display message to the console when up and running
			console.log('I am ready!');
		});
	}
	authenticate(callback){
		let self = this;
		rl.question("Discord Bot Key > ", function(answer) {
			try {
				self.client.login(answer);
				callback(answer);
			} catch(err) {
				self.authenticate(callback); //Loop until valid
			}
		});
	}
}

module.exports = new discord();