"use strict";

const Datastore = require('nedb');
const Data = require('./data.js');

class Users extends Data {
	constructor(dbPath, callback){
		super(dbPath);
	}
	addCurrency(message){
		let amount = parseInt(message.cleanContent.match(/[\d]+/));
		for(var user of message.mentions.users){
			message.reply('I gave ' + amount + ' to ' + user);
			break;
		}		
	}
	subtractCurrency(message){
		message.reply(message.cleanContent);
	}
}

module.exports = Users;