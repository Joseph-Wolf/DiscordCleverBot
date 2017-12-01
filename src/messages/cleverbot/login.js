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
	if(params.cleverbot === null || params.cleverbot === undefined){
		console.error('null or undefined cleverbot');
		return callback('There was an error logging into cleverbot');
	}
	if(!params.isAdmin){
		return callback('You must be an administrator to use this command');
	}
	return callback(null);
}

function upsertCredentials(db, dbKey, value, callback){
	db.update({key: dbKey}, {$set: {value: value}}, {upsert: true}, callback);
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
		let cleverbot = params.cleverbot;
		let user = text.split(/:/)[0].match(/[\S]+$/)[0];
		let key = text.split(/:/)[1].match(/^[\S]+/)[0];
		
		//Will this work without a require?
		cleverbot.authenticate({user: user, pass: key}, function(err, accepted){
			if(err){
				console.error(err);
				return callback('Failed to authenticate with provided credentials.\n(auth|login) cleverbot {user}:{token}');
			}
			return upsertCredentials(db, cleverbot.DBKey, accepted, function(err){
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