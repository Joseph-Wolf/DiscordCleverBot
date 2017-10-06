"use strict";

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
	db.find({discordId: user.discordId}, function(err, docs){
		if(err || docs === null || docs === undefined || docs.length === 0){
			return callback('I encountered an error checking users ballance');
		}
		let reply = '';
		let index = 0;
		for(index = 0; index < docs.length; index++){
			let user = docs[index];
			if(currencyName) {
				reply = reply + user.name + ' has ' + user.money + ' ' + currencyName + 's';
			} else {
				reply = reply + user.name + ' has a ballance of ' + user.money;
			}
		}
		return callback(null, reply);
	});
}