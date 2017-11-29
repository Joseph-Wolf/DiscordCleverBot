"use strict";

function validation(params, callback){
	if(params === null || params === undefined){
		console.error('null or undefined params.');
		return callback('Invalid parameters passed to the ballance function.');
	}
	if(params.text === null || params.text === undefined){
		console.error('null or undefined text.');
		return callback('Invalid parameters passed to the ballance function.');
	}
	if(params.db === null || params.db === undefined){
		console.error('null or undefined db.');
		return callback('Invalid parameters passed to the ballance function.');
	}
	if(params.users === null || params.users === undefined || params.users.length === 0){
		return callback('Please mention a user to check the ballance of');
	}
	return callback(null);
}
function findUsers(db, users, callback){
	let userIds = users.map(function(user){return {discordId: user.discordId}});
	return db.find({ $or: userIds }).toArray(callback);
}
function generateReply(foundUsers, currencyName, callback){
	if(foundUsers === null || foundUsers === undefined){
		return callback(null);
	}
	let reply = '';
	for(let index = 0; index < foundUsers.length; index++){
		reply = reply + index > 0 ? '\n':'' + foundUsers[index].name + ' has a ballance of ' + foundUsers[index].money;
		if(currencyName) {
			reply = reply  + ' ' + currencyName + 's';
		}
	}
	return callback(null, reply);
}

module.exports = function(err, callback, params){
	if(err){
		console.error(err);
		return callback('I encountered an error checking ballance.');
	}
	return validation(params, function(err){
		if(err){
			return callback(err);
		}
		let text = params.text;
		let db = params.db;
		let users = params.users;
		let currencyName = params.currencyName;

		let amount = parseInt(text.match(/[\d]+/));

		//Get the user from the DB
		return findUsers(db, users, function(err, foundUsers){
			if(err){
				console.error(err);
				return callback('I encountered an error checking the ballance of users.');
			}
			if(foundUsers === null || foundUsers === undefined  || foundUsers.length === 0){
				return callback('I did not find any users with those names');
			}
			for(let index = 0; index < foundUsers.length; index++){
				foundUsers[index].name = users.filter(function(user){return user.discordId === foundUsers[index].discordId})[0].name;
			}
			let usersSortedByName = foundUsers.sort(function(a, b){return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;});
			return generateReply(usersSortedByName, currencyName, callback);
		});
	});
}