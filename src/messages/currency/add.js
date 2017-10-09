"use strict";

const isPositiveInteger = require('../../util/isPositiveInteger.js');

module.exports = function(err, callback, params){
	if(err || params === null || params === undefined || params.text === null || params.text === undefined || params.db === null || params.db === undefined){
		return callback('Error Adding currency');
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

	if(!isPositiveInteger(amount)){
		return callback('Invalid amount passed.');
	}
	//Get the user from the DB
	db.find({discordId: user.discordId}, function(err, docs){
		if(err || docs === null || docs === undefined || docs.length === 0){ //If user was not found insert it
			return db.insert({discordId: user.discordId, name: user.name, money: amount}, function(err, doc){
				if(err){
					return callback('I encountered an error adding currency to users');
				}
				return callback(null, 'I added ' + amount + ' ' + currencyName + ' to ' + doc.name);
			});
		}
		//Add the money to the retrieved user
		return db.update({ $or: docs}, {$inc: {money: amount}}, { upsert: true, multi: true, returnUpdatedDocs: true }, function(err, count, docs){
			if(err){
				return callback('I encountered an error adding currency to users');
			}
			let reply = 'I added ' + amount + ' ' + currencyName + ' to ';
			let index = 0;
			for(index = 0; index < docs.length; index++){
				let user = docs[index];
				reply = reply + (index > 0 ? ', ' : '') + user.name;
			}
			return callback(null, reply); //TODO: print all user names
		});
	});
}