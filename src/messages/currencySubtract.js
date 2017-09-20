"use strict";

module.exports = function(err, callback, params){
	if(err || params === null || params === undefined || params.text === null || params.text === undefined || params.db === null || params.db === undefined || params.user === null || params.user === undefined){
		return callback('Error Subtracting currency');
	}
	let text = params.text;
	let db = params.db;
	let user = params.user;

	let amount = parseInt(text.match(/[\d]+/));

	//Get the user from the DB
	db.get(user, function(err, doc){
		if(err){
			return callback('I encountered an error giving money to user');
		}
		//Add the money to the retrieved user
		doc.subtractMoney(amount, function(err, ballance){
			if(err){
				return callback(err);
			}
			//Update the user
			db.set(doc, function(err, doc){
				if(err){
					return callback('I encountered an error taking money to user');
				}
				return callback(null, 'I took ' + amount + ' to ' + doc.name);
			});
		});
		
	});
}