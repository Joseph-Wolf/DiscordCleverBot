"use strict";

const isPositiveInteger = require('../../util/isPositiveInteger.js');

module.exports = function(err, callback, params){
	if(err || params === null || params === undefined || params.text === null || params.text === undefined || params.db === null || params.db === undefined){
		return callback('Error Subtracting currency');
	}
	if(!params.isAdmin){
		return callback('You must be an administrator to use this command');
	}
	if(params.user === null || params.user === undefined){
		return callback('Please mention a user');
	}
	let text = params.text;
	let user = params.user;
	let db = params.db;
	let currencyName = params.currencyName;

	let amount = parseInt(text.match(/[\d]+/));

	if(isPositiveInteger(amount)){
		return callback('Invalid amount passed.');
	}

	//Get the users from the DB
	db.find({discordId: user.discordId}, function(err, docs){ //TODO: iterate for many users and concatenate the reply
		if(err || docs === null || docs === undefined || docs.length === 0){
			return callback('I encountered an error giving money to user');
		}
		//Subtract the money to the retrieved user
		let reply = '';
		let index = 0;
		for(index = 0; index < docs.length; index++){
			let user = docs[index];
			if(user.money < amount){
				reply = reply + user.name + ' has Insufficient funds.';
				docs[index] = null; //Remove invalid user from selection
			}
		}
		db.update(docs, {$inc: {money: -amount}}, { upsert: true, multi: true }, function(err, count, docs){
			if(err || docs === null || docs === undefined || docs.length === 0){
				return callback('I encountered an error taking money to user');
			}
			let index = 0;
			for(index = 0; index < docs.length; index++){
				let user = docs[index];
				reply = reply + 'I took ' + amount + ' ' + currencyName + 's from ' + user.name
			}
			return callback(null, reply);
		});
	});
}