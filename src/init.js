"use strict";

const registerDiscordbot = require('./init/registerDiscordbot.js');
const registerBotIsPlaying = require('./init/registerBotIsPlaying.js');
const registerWelcomeUsers = require('./init/registerWelcomeUsers.js');
const registerMessages = require('./init/registerMessages.js');
const currencyNameSettingKey = 'CurrencyName';
const currencyNameDefaultValue = 'Crystal';
const cleverbotSettingKey = 'CleverbotKey';
const welcomeUsersSettingKey = 'WelcomeUsers';

module.exports = function(db, discord, config){
	return registerDiscordbot(discord, function(err){
		if(err){
			throw new Error(err);
		}
		registerMessages(db, discord, currencyNameSettingKey, currencyNameDefaultValue, cleverbotSettingKey);
		registerWelcomeUsers(db, discord, welcomeUsersSettingKey);
		registerBotIsPlaying(discord, config.botIsPlaying);
	});
};