"use strict";

module.exports = function(err, callback, params){
	if(err || params === null || params === undefined || params.text === null || params.text === undefined || params.db === null || params.db === undefined){
		return callback('Error checking ballance');
	}
	if(params.users === null || params.users === undefined || params.users.length === 0){
		return callback('Please mention a user to check the ballance of');
	}
	let text = params.text;
	let db = params.db;
	let users = params.users;
	let currencyName = params.currencyName;

	let amount = parseInt(text.match(/[\d]+/));

	//Get the user from the DB
	return db.find({ discordId: { $in: users.map(x => x.discordId) }}, function(err, docs){
		if(err || docs === null || docs === undefined || docs.length === 0){
			return callback('I encountered an error checking users ballance');
		}
		if(docs === null || docs === undefined  || docs.length === 0){
			return callback('I did not find any users with those names');
		}
		//Sort by user name
		docs = docs.sort(function(a, b){return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;});
		let reply = '';
		for(let index = 0; index < docs.length; index++){
			reply = reply + index > 0 ? '\n':'' + docs[index].name + ' has a ballance of ' + docs[index].money;
			if(currencyName) {
				reply = reply  + ' ' + currencyName + 's';
			}
		}
		return callback(null, reply);
	});
}