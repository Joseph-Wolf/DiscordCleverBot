"use strict";

const isPositiveInteger = require('is-positive-integer');

function validate(params, callback){
	if(params === null || params === undefined){
		console.error('null or undefined params.');
		return callback('Invalid parameters passed to subtract function.');
	}
	if(params.text === null || params.text === undefined){
		console.error('null or undefined text.');
		return callback('Invalid parameters passed to subtract function.');
	}
	if(params.db === null || params.db === undefined){
		console.error('null or undefined db.');
		return callback('Invalid parameters passed to subtract function.');
	}
	if(!params.isAdmin){
		return callback('You must be an administrator to use this command');
	}
	if(params.users === null || params.users === undefined || params.users.length === 0){
		return callback('Please mention a user');
	}
	return callback(null);
}
function findUsersWithSufficientFunds(db, userIds, amount, callback){
	return db.find({$and: [{$or: userIds}, {money: {$gte: amount}}]}).toArray(callback);
}
function takeCurrencyFromUsers(db, userIds, amount, callback){
	return db.update({$or: userIds}, {$inc: {money: -amount}}, {multi: true}, callback);
}
function constructSuccessfulReply(userNames, amount, currencyName, callback){
	let reply = 'I took ' + amount + ' ' + currencyName + 's from ';
	for(let index = 0; index < userNames.length; index++){
		reply = reply + (index > 0 ? ', ' : '') + userNames[index];
	}
	return callback(null, reply);
}
function constructInvalidAmountReply(users, foundUsers, callback){
	let foundUserIds = foundUsers.map(x => x.discordId);
	let missingUserNames = users.filter(function(user){return foundUserIds.indexOf(user.discordId) < 0}).map(x => x.name);
	let reply = 'The following users have insufficient funds: ';
	for(let index = 0; index < missingUserNames.length; index++){
		reply = reply + (index > 0 ? ', ' : '') + missingUserNames[index];
	}
	return callback(reply);
}

module.exports = function(err, callback, params){
	if(err){
		console.error(err);
		return callback('I encountered an error subtracting currency.');
	}
	return validate(params, function(err){
		if(err){
			return callback(err);
		}
		let text = params.text;
		let users = params.users;
		let db = params.db;
		let currencyName = params.currencyName;
		let userIds = users.map(function(user){return {discordId: user.discordId}});

		let amount = parseInt(text.match(/[\d]+/));

		if(!isPositiveInteger(amount)){
			return callback('Invalid amount passed.');
		}

		return findUsersWithSufficientFunds(db, userIds, amount, function(err, foundUsers){
			if(err){
				console.err(err);
				return callback('I encountered an error finding users.');
			}
			if(users.length === foundUsers.length){ //take money from users
				return takeCurrencyFromUsers(db, userIds, amount, function(err){
					if(err){
						console.error(err);
						return callback('I encountered an error taking currency from users.')
					}
					let sortedUserNames = users.sort(function(a, b){return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;}).map(x => x.name);
					return constructSuccessfulReply(sortedUserNames, amount, currencyName, callback);
				});
			}
			return constructInvalidAmountReply(users, foundUsers, callback);
		});
	});
}