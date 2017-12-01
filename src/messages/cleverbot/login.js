"use strict";

function validate(params, callback){
	if(params === null || params === undefined ){
		console.error('null or undefined params');
		return callback('There was an error logging into cleverbot');
	}
	if(params.text === null || params.text === undefined){
		console.error('null or undefined text');
		return callback('There was an error logging into cleverbot');
	}
	if(params.db === null || params.db === undefined){
		console.error('null or undefined db');
		return callback('There was an error logging into cleverbot');
	}
	if(params.key === null || params.key === undefined){
		console.error('null or undefined key');
		return callback('There was an error logging into cleverbot');
	}
	if(!params.isAdmin){
		return callback('You must be an administrator to use this command');
	}
	return callback(null);
}

function upsertCredentials(db, dbKey, credentialUser, credentialKey, callback){
	return db.update({key: dbKey}, {$set: {value: {user: credentialUser, key: credentialKey}}}, {upsert: true}, callback);
}

module.exports = function(err, params, callback){
	if(err){
		console.error(err);
		return callback('I encountered an error setting the cleverbot credentials');
	}
	return validate(params, function(err){
		if(err){
			return callback(err);
		}
		let text = params.text;
		let db = params.db;
		let settingKey = params.key;
		let credentialUser = text.split(/:/)[0].match(/[\S]+$/)[0];
		let credentialKey = text.split(/:/)[1].match(/^[\S]+/)[0];
		
		return upsertCredentials(db, settingKey, credentialUser, credentialKey, function(err){
			if(err){
				console.error(err);
				return callback('Error setting cleverbot credentials in the Database');
			}
			//TODO: verify credentials and return error if they don't work
			//TODO: figure out how to delete the message for security
			//message.delete().catch(callback('I can not delete the message your credentials.\nPlease grant permission or manually remove them for security.'));
			return callback(null, 'Success!!');
		});
	});
}