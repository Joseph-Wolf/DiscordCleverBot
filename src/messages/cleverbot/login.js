"use strict";

const betterCleverbotIO = require('better-cleverbot-io');

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

function generateSettingValue(credentialsUser, credentialsKey){
	return {user: credentialsUser, key: credentialsKey};
}

function upsertCredentials(db, key, value, callback){
	return db.update({key: key}, {$set: {value: value}}, {upsert: true}, callback);
}

function deleteMessage(){
	//TODO: figure out how to delete the message for security
	//message.delete().catch(callback('I can not delete the message your credentials.\nPlease grant permission or manually remove them for security.'));
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
		let cleverbot = (params.cleverbot || betterCleverbotIO);
		let credentialUser = text.split(/:/)[0].match(/[\S]+$/)[0];
		let credentialKey = text.split(/:/)[1].match(/^[\S]+/)[0];
		
		let value = generateSettingValue(credentialUser, credentialKey);

		return upsertCredentials(db, settingKey, value, function(err){
			if(err){
				console.error(err);
				return callback('Error setting cleverbot credentials in the Database');
			}
			return new cleverbot(value).create().then(() => {
				deleteMessage();
				return callback(null, 'Success!!');
			}).catch(err => {
				console.error(err);
				deleteMessage();
				return callback('Invalid credentials.');
			});
		});
	});
}