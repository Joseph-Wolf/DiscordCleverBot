"use strict";

//TODO: how can I contact the user DB?

module.exports = function(err, callback, params){
	if(err || params === null || params === undefined || params.text === null || params.text === undefined || params.db === null || params.db === undefined){
		return callback('Error checking ballance');
	}
	if(params.user === null || params.user === undefined){
		return callback('Please mention a user to check the ballance of');
	}
	let text = params.text;
	let db = params.db;
	let user = params.user;
	let currencyName = params.currencyName;

	let amount = parseInt(text.match(/[\d]+/));

	//Get the user from the DB
	db.get({discordId: user.discordId}, function(err, doc){
		if(err){
			return callback('I encountered an error checking users ballance');
		}
		if(doc === null || doc === undefined){
			return callback('I did not find that user.');
		}
		//Add the money to the retrieved user
		let reply = doc.name + ' has a ballance of ' + doc.money;
		if(currencyName){
			reply = doc.name + ' has ' + doc.money + ' ' + currencyName + 's';
		}
		return callback(null, reply);
	});
}