"use strict";

const registerDiscordbot = require('./init/registerDiscordbot.js');
const registerBotIsPlaying = require('./init/registerBotIsPlaying.js');
const registerMessages = require('./init/registerMessages.js');
const choose = require('./messages/choose.js');
const showMe = require('./messages/showMe.js');
const coinFlip = require('./messages/coinFlip.js');
const getFact = require('./messages/getFact.js');
const cleverbotLogin = require('./messages/cleverbot/login.js');
const cleverbotAsk = require('./messages/cleverbot/ask.js');
const currencySetName = require('./messages/currency/setName.js');
const currencyAdd = require('./messages/currency/add.js');
const currencySubtract = require('./messages/currency/subtract.js');
const currencyBallance = require('./messages/currency/ballance.js');
const currencyNameSettingKey = 'CurrencyName';
const currencyNameDefaultValue = 'Crystal';
const cleverbotSettingKey = 'CleverbotKey';

function registerMessage(settings, users, client){
	settings.find({key: currencyNameSettingKey}).limit(1).toArray(function(err, items){
		if(err){
			console.error(err);
			return callback('Error reading currencyName from the database');
		}
		let currencyName = currencyNameDefaultValue;
		if(items !== null && items !== null && items[0] !== null && items[0] !== undefined && items[0].value !== null && items[0].value !== undefined){
			currencyName = items[0].value;
		}
		registerMessages(client, [{expression: /show me/i, callback: showMe},
			{expression: /choose/i, callback: choose},
			{expression: /flip a coin/i, callback: coinFlip},
			{expression: /fact[s]? about/i, callback: getFact},
			{expression: /(auth|login).+?cleverbot/i, callback: cleverbotLogin, additionalParams: {db: settings, key: cleverbotSettingKey}},
			{expression: /currency.+?name/i, callback: currencySetName, additionalParams: {db: settings, key: currencyNameSettingKey, registerMessagesCallback: function(){
				registerMessage(settings, users, client);
			}}},
			//Register currency commands
			{expression: /bal.+?of/i, callback: currencyBallance, additionalParams: {db: users, currencyName: currencyName}},
			{expression: new RegExp('[\\d]+[\\s]+' + currencyName + '[s]?[\\s]+(to)','i'), callback: currencyAdd, additionalParams: {db: users, currencyName: currencyName}},
			{expression: new RegExp('[\\d]+[\\s]+' + currencyName + '[s]?[\\s]+(from)', 'i'), callback: currencySubtract, additionalParams: {db: users, currencyName: currencyName}},
			{expression: /./i, callback: cleverbotAsk, additionalParams: {db: settings, key: cleverbotSettingKey}}] //This needs to be added last
		);
	});
}

module.exports = function(settings, users, client, config, callback){
	return registerDiscordbot(client, function(err, client){
		if(err){
			return callback(err);
		}
		let messages = registerMessage(settings, users, client);
		return registerMessages(client, messages, function(err){
			if(err){
				return callback(err);
			}
			return registerBotIsPlaying(client, config.botIsPlaying, callback); //TODO: read config from the settingsDB
		});
	});
};