"use strict";

const Setting = require('../../db/class/setting.js');

module.exports = function(err, callback, params){
	if(err || params === null || params === undefined || params.text === null || params.text === undefined || params.cleverbot === null || params.cleverbot === undefined || params.db === null || params.db === undefined || params.key === null || params.key === undefined){
		return callback('There was an error logging into cleverbot');
	}
	let cleverbot = params.cleverbot;
	let db = params.db;
	let text = params.text;

	let user = text.split(/:/)[0].match(/[\S]+$/)[0];
	let key = text.split(/:/)[1].match(/^[\S]+/)[0];
	
	//Will this work without a require?
	cleverbot.authenticate({user: user, key: key}, function(err, accepted){
		if(err){
			return callback('Failed to authenticate with provided credentials.\n(auth|login) cleverbot {user}:{token}');
		}
		db.get({key: cleverbot.DBKey}, function(err, doc){
			if(err){
				doc = new Setting({key: cleverbot.DBKey});
			}
			doc.value = accepted;
			db.set(doc, function(err, doc){
			if(err){
				console.error(err);
				return callback("Error setting cleverbot credentials in the Database");
			}
			return callback(null, 'Success!!');
		});
		})
	});
	
	//TODO: figure out how to delete the message for security
	//message.delete().catch(callback('I can not delete the message your credentials.\nPlease grant permission or manually remove them for security.'));
}