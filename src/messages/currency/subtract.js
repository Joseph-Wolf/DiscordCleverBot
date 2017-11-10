"use strict";

const isPositiveInteger = require('../../util/isPositiveInteger.js');

module.exports = function(err, callback, params){
	if(err || params === null || params === undefined || params.text === null || params.text === undefined || params.db === null || params.db === undefined){
		return callback('Error Subtracting currency');
	}
	if(!params.isAdmin){
		return callback('You must be an administrator to use this command');
	}
	if(params.users === null || params.users === undefined || params.users.length === 0){
		return callback('Please mention a user');
	}
	let text = params.text;
	let users = params.users;
	let db = params.db;
	let currencyName = params.currencyName;

	let amount = parseInt(text.match(/[\d]+/));

	if(!isPositiveInteger(amount)){
		return callback('Invalid amount passed.');
	}

	//Get the users from the DB
	return db.find({ discordId: { $in: users.map(x => x.discordId) }}, function(err, docs){
		if(err || docs === null || docs === undefined || docs.length === 0){
			return callback('I encountered an error taking money from user');
		}
		//Make sure all users were found
		if(docs.length !== users.length){
			let foundIds = docs.map(x => x.discordId);
			let missingUsers = users.filter(x => foundIds.indexOf(x.discordId) === -1);
			let errorMessage = 'The following users have insufficient funds:';
			for(let index = 0; index < missingUsers.length; index++){
				errorMessage = errorMessage + index > 0 ? ', ':' ' + missingUsers[index].name;
			}
			return callback(errorMessage);
		}

		//Make sure all users have enough
		for(let index = 0; index < docs.length; index++){
			let user = docs[index];
			if(user.money < amount){
				return callback(user.name + ' has Insufficient funds');
			}
		}

		//Subtract the money to the retrieved user
		return db.update({ $or: docs }, {$inc: {money: -amount}}, { multi: true, returnUpdatedDocs: true }, function(err, count, docs){
			if(err || docs === null || docs === undefined || docs.length === 0){
				return callback('I encountered an error taking money to user');
			}
			if(docs === null || docs === undefined  || docs.length === 0){
				return callback('I did not find any users with those names');
			}
			docs = docs.sort(function(a, b){return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;});
			let reply = 'I took ' + amount + ' ' + currencyName + 's from ';
			for(let index = 0; index < docs.length; index++){
				let user = docs[index];
				reply = reply + (index > 0 ? ', ' : '') + user.name;
			}
			return callback(null, reply);
		});
	});
}