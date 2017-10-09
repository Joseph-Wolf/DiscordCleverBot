"use strict";

module.exports = function(err, callback, params){
	if(err || params === null || params === undefined || params.text === null || params.text === undefined || params.db === null || params.db === undefined || params.cleverbot === null || params.cleverbot === undefined){
		return callback('There was an error logging into cleverbot');
	}
	if(!params.isAdmin){
		return callback('You must be an administrator to use this command');
	}
	let text = params.text;
	let db = params.db;
	let cleverbot = params.cleverbot;
	let user = text.split(/:/)[0].match(/[\S]+$/)[0];
	let key = text.split(/:/)[1].match(/^[\S]+/)[0];
	
	//Will this work without a require?
	cleverbot.authenticate({user: user, key: key}, function(err, accepted){
		if(err){
			console.error(err);
			return callback('Failed to authenticate with provided credentials.\n(auth|login) cleverbot {user}:{token}');
		}
		let query = {key: cleverbot.DBKey};
		return data.find(query).limit(1).exec(function(err, doc){
			if(err || doc === null || doc === undefined || doc.length === 0){
				query.value = accepted;
				return data.insert(query, function(err, doc){
					if(err){
						console.error(err);
						return callback("Error setting cleverbot credentials in the Database");
					}
					return callback(null, 'Success!!');
				});
			}
			return data.update(doc[0], {$set: {value: accepted}}, function(err, doc){
				if(err){
					console.error(err);
					return callback("Error setting cleverbot credentials in the Database");
				}
				return callback(null, 'Success!!');
			});
		});
	});
	
	//TODO: figure out how to delete the message for security
	//message.delete().catch(callback('I can not delete the message your credentials.\nPlease grant permission or manually remove them for security.'));
}