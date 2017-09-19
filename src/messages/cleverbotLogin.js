"use strict";

module.exports = function(err, params, callback){
	if(err || params === null || params === undefined || params.text === null || params.text === undefined || params.cleverbot === null || params.cleverbot === undefined || params.db === null || params.db === undefined){
		return callback('There was an error logging into cleverbot');
	}
	let cleverbot = params.cleverbot;
	let db = params.db;
	let text = params.text;

	let user = text.split(/:/)[0].match(/[\S]+$/)[0];
	let token = text.split(/:/)[1].match(/^[\S]+/)[0];
	
	//Will this work without a require?
	cleverbot.authenticate(user, token, function(err, accepted){
		if(success){
			let data = keys.CleverbotKey;
			data.user = accepted.user;
			data.value = accepted.key;
			db.set(data);
			return callback(null, 'Success!!');
		}
		return callback('Failed to authenticate with provided credentials.\n(auth|login) cleverbot {user}:{token}');
	});
	
	//TODO: figure out how to delete the message for security
	//message.delete().catch(callback('I can not delete the message your credentials.\nPlease grant permission or manually remove them for security.'));
}