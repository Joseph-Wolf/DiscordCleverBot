"use strict";

const prompt = require('prompt');
const registerWelcomeUsers = require('./registerWelcomeUsers.js');
const registerMessages = require('./registerMessages.js');
const registerBotIsPlaying = require('./registerBotIsPlaying.js');

function authenticateDiscordWithKey(key, discord, callback){
	discord.authenticate(key, function(err, accepted){
		if(err){ //Loop until valid credentials are passed
			let question = 'Discord Bot Key > ';
			prompt.start();
			prompt.get(question, function (err, result) {
				if (err) {
					console.error(err);
					return 1;
				}
				authenticateDiscordWithKey(result[question], discord, callback);
				return;
			});
			return;
		}
		return callback(null, accepted);
	});
}
module.exports = function (db, discord, cleverbot){
	return db.find({key: discord.DBKey}).limit(1).exec(function(err, docs){
		if(err || docs === null || docs.length === 0) {
			docs = [{key: discord.DBKey, value: null}];
		}
		return authenticateDiscordWithKey(docs[0].value, discord, function(err, key){
			if(err){
				console.error('rejected Discord key');
				return;
			}
			db.update({key: discord.DBKey}, {$set:{value: key}}, {milti: false, upsert: true}, function(err){
				if(err){
					console.error(err);
					return;
				}
				registerMessages(db, discord, cleverbot);
				registerWelcomeUsers(db, discord);
				return;
			});
		});
	});
}
