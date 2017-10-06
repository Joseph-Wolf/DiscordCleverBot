"use strict";

module.exports = function(err, callback, params){
	if(err || params === null || params === undefined || params.text === null || params.text === undefined || params.text.trim() === '' || params.key === null || params.key === undefined || params.db === null || params.db === undefined){
		return callback('Unable to set the name of the currency');
	}
	if(!params.isAdmin){
		return callback('You must be an administrator to use this command');
	}
	let text = params.text.trim();
	let key = params.key;
	let db = params.db;
	let registerMessagesCallback = params.registerMessagesCallback;

	let value = text.match(/[\S]+$/)[0].replace(/s$/i,'');

	db.findOne({key: key}, function(err, doc){
		if(err || doc === undefined || doc === null){ //Did not find the setting. Make a new one
			db.insert({key: key, value: value}, function(err, doc){
				if(err){
					return callback('Failed to insert currency name into the database');
				}
				if(registerMessagesCallback){ //Reset all the messages after changing something one of them depends on.
					registerMessagesCallback();
				}
				return callback(null, 'I set your currency to ' + doc.value);
			});
		}
		db.update(doc, {$set:{value: value}}, function(err, doc){
			if(err){
				return callback('Failed to update currency name');
			}
			if(registerMessagesCallback){ //Reset all the messages after changing something one of them depends on.
				registerMessagesCallback();
			}
			return callback(null, 'I set your currency to ' + doc.value);
		});
	});
};