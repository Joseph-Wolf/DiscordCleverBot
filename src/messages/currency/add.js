"use strict";

const isPositiveInteger = require('is-positive-integer');

function validation(params, callback){
	if(params === null || params === undefined){
		console.error('null or undefined params');
		return callback('Invalid parameters passed to add function.');
	}
	if(params.text === null || params.text === undefined){
		console.error('null or undefined text')
		return callback('Invalid parameters passed to add function.');
	}
	if(params.db === null || params.db === undefined){
		console.error('null or undefined db.')
		return callback('Invalid parameters passed to add function.');
	}
	if(!params.isAdmin){
		return callback('You must be an administrator to use this command');
	}
	if(params.users === null || params.users === undefined || params.users.length === 0){
		return callback('Please mention a user');
	}
	return callback(null);
}
function upsertUsers(db, users, amount, callback){
	let userIds = users.map(function(user){return {discordId: user.discordId}});
	return db.update({$or: userIds}, {$inc: {money: amount}}, {multi: true, upsert: true}, callback);
}
function getSuccessfulReply(users, amount, currencyName, callback){
	let reply = 'I added ' + amount;
	if(currencyName !== null && currencyName !== undefined){
		reply = reply + ' ' + currencyName;
	}
	reply = reply + ' to ';
	let userNames = users.map(user => user.name);
	for(let index = 0; index < userNames.length; index++){
		reply = reply + (index > 0 ? ', ' : '') + userNames[index];
	}
	return callback(null, reply);
}

module.exports = function(err, callback, params){
	if(err){
		console.error(err);
		return callback('I encountered an error adding currency!');
	}
	return validation(params, function(err){
		if(err){
			return callback(err);
		}
		let text = params.text;
		let users = params.users;
		let db = params.db;
		let currencyName = params.currencyName;

		let amount = parseInt(text.match(/[\d]+/));

		if(!isPositiveInteger(amount)){
			return callback('Invalid amount passed.');
		}
		return upsertUsers(db, users, amount, function(err){
			if(err){
				console.error(err);
				return callback('I encountered an error trying to add currency to user');
			}
			return getSuccessfulReply(users, amount, currencyName, callback);
		});
	});
}