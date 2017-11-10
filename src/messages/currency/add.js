"use strict";

const isPositiveInteger = require('../../util/isPositiveInteger.js');

module.exports = function(err, callback, params){
	if(err || params === null || params === undefined || params.text === null || params.text === undefined || params.db === null || params.db === undefined){
		return callback('Error Adding currency');
	}
	if(!params.isAdmin){
		return callback('You must be an administrator to use this command');
	}
	if(params.users === null || params.users === undefined){
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

	return db.find({ discordId: { $in: users.map(x => x.discordId) }}, function(err, docs){
		if(err){
			return callback('I encountered an error adding currency to users');
		}

		//Check for missing documents
		let missingUsers = [];
		if(docs === null || docs === undefined || docs.length === 0){ //Add all documents as missing
			missingUsers = users
		} else if(docs.length !== users.length) { //Add only missing documents
			let foundIds = docs.map(x => x.discordId);
			missingUsers = users.filter(x => foundIds.indexOf(x.discordId) === -1);
		}
		if (missingUsers.length > 0) { //If any documents are missing then add them
			let missingDocs = missingUsers.map(function(user){return {discordId: user.discordId, name: user.name, money: 0}});
			db.insert(missingDocs, function(err, doc){
				if(err){
					return callback('I encountered an error adding currency to users');
				}
			});
			//Append the missing docs so they will be updated
			//These will be missing the document ids but should contain the discordId
			docs = docs.concat(missingDocs);
		}

		//Add the money to the retrieved user
		return db.update({ $or: docs}, {$inc: {money: amount}}, { upsert: true, multi: true, returnUpdatedDocs: true }, function(err, count, docs){
			if(err){
				return callback('I encountered an error adding currency to users');
			}
			docs = docs.sort(function(a, b){return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;});
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