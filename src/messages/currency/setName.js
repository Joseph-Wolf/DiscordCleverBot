"use strict";

function validation(params, callback){
	if(params === null || params === undefined){
		console.error('null or undefined params');
		return callback('Invalid parameters passed into the set currency name function.');
	}
	if(params.text === null || params.text === undefined || params.text.trim() === ''){
		console.error('null or undefined text');
		return callback('Invalid parameters passed into the set currency name function.');
	}
	if(params.key === null || params.key === undefined){
		console.error('null or undefined key');
		return callback('Invalid parameters passed into the set currency name function.');
	}
	if(params.db === null || params.db === undefined){
		console.error('null or undefined db');
		return callback('Invalid parameters passed into the set currency name function.');
	}
	if(!params.isAdmin){
		return callback('You must be an administrator to use this command');
	}
	return callback(null);
}
function upsertNewName(db, keyValue, newName, callback){
	return db.update({key: keyValue}, {$set: {value: newName}}, {upsert: true}, callback);
}

module.exports = function(err, callback, params){
	if(err){
		console.error(err);
		return callback('I encountered an error setting the currency name.');
	}
	return validation(params, function(err){
		if(err){
			return callback(err);
		}
		let text = params.text.trim();
		let name = params.key;
		let db = params.db;
		let registerMessagesCallback = params.registerMessagesCallback;

		let value = text.match(/[\S]+$/)[0].replace(/s$/i,'');

		return upsertNewName(db, name, value, function(err){
			if(err){
				console.error(err);
				return callback('I encountered an error setting the currency name.');
			}
			if(registerMessagesCallback){ //Reset all the messages after changing something one of them depends on.
				registerMessagesCallback();
			}
			return callback(null, 'I set your currency to ' + value);
		});
	});
};