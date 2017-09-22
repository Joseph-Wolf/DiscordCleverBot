"use strict";

const choose = require('../messages/choose.js');
const showMe = require('../messages/showMe.js');
const coinFlip = require('../messages/coinFlip.js');
const getFact = require('../messages/getFact.js');
const cleverbotLogin = require('../messages/cleverbot/login.js');
const cleverbotAsk = require('../messages/cleverbot/ask.js');
const currencyAdd = require('../messages/currency/add.js');
const currencySubtract = require('../messages/currency/subtract.js');
const currencyBallance = require('../messages/currency/ballance.js');
const CurrencyNameSettingKey = 'CurrencyName';
const CurrencyNameDefaultValue = 'onion';

module.exports = function (settingsDb, discord, cleverbot, usersDb){
	discord.registerMessage(/show me/i, showMe);
	discord.registerMessage(/choose/i, choose);
	discord.registerMessage(/flip a coin/i, coinFlip);
	discord.registerMessage(/fact[s]? about/i, getFact);
	discord.registerMessage(/(auth|login).+?cleverbot/i, cleverbotLogin);
	discord.registerMessage(/bal.+?of/i, currencyBallance, {db: usersDb});
	settingsDb.get({key: CurrencyNameSettingKey}, function(err, doc){
		if(err || doc === null || doc === undefined){
			doc = {value: CurrencyNameDefaultValue};
		}
		let CurrencyName = doc.value;
		//Register currency commands
		discord.registerMessage(new RegExp('[\\d]+[\\s]+' + CurrencyName + '[s]?[\\s]+(to)','i'), currencyAdd, {db: usersDb});
		discord.registerMessage(new RegExp('[\\d]+[\\s]+' + CurrencyName + '[s]?[\\s]+(from)', 'i'), currencySubtract, {db: usersDb});
	});
	discord.registerMessage(/./i, cleverbotAsk, {cleverbot: cleverbot});
}