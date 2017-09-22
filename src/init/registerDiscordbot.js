"use strict";

const prompt = require('prompt');
const getConsoleInput = require('../util/getConsoleInput.js');
const registerWelcomeUsers = require('./registerWelcomeUsers.js');
const registerMessages = require('./registerMessages.js');
const registerBotIsPlaying = require('./registerBotIsPlaying.js');
const Setting = require('../db/class/setting.js');
const DiscordbotSettingKey = 'DiscordToken';

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
				authenticateDiscordWithKey(result[question], discord, callback)
			});
		}
		return callback(null, accepted);
	});
}
module.exports = function (settingsDb, discord, cleverbot, usersDb, config){
	settingsDb.get({key: DiscordbotSettingKey}, function(err, doc){
		if(err || doc === null) {
			doc = {value: null};
		}
		return authenticateDiscordWithKey(doc.value, discord, function(err, key){
			if(err){
				return console.log('rejected Discord key');
			}
			settingsDb.set(new Setting({key: DiscordbotSettingKey, value: key}));
			registerMessages(settingsDb, discord, cleverbot);
			registerWelcomeUsers(settingsDb, discord);
			return console.log('accepted Discord key');
		});
	});
}
