"use strict";

const choose = require('../messages/choose.js');
const showMe = require('../messages/showMe.js');
const coinFlip = require('../messages/coinFlip.js');
const getFact = require('../messages/getFact.js');
const cleverbotLogin = require('../messages/cleverbotLogin.js');
const cleverbotAsk = require('../messages/cleverbotAsk.js');
const currencyAdd = require('../messages/currencyAdd.js');
const currencySubtract = require('../messages/currencySubtract.js');
const CurrencyNameSettingKey = 'CurrencyName';
const CurrencyNameDefaultValue = 'onion';

module.exports = function (db, discord, cleverbot, usersDb){
	discord.registerMessage(/show me/i, message.showMe);
	discord.registerMessage(/choose/i, message.choose);
	discord.registerMessage(/flip a coin/i, message.coinFlip);
	discord.registerMessage(/fact[s]? about/i, message.getFact);
	discord.registerMessage(/(auth|login).+?cleverbot/i, message.cleverbotLogin);
	db.get({key: CurrencyNameSettingKey}, function(err, doc){
		if(err){
			return;
		}
		if(doc === null){ //set default currency if one is not provided
			doc.value = CurrencyNameDefaultValue;
		}
		let CurrencyName = doc.value;
		//Register currency commands
		discord.registerMessage(new RegExp('[\\d]+[\\s]+' + CurrencyName + '[s]?[\\s]+(to)','i'), message.currencyAdd, {db: usersDb});
		discord.registerMessage(new RegExp('[\\d]+[\\s]+' + CurrencyName + '[s]?[\\s]+(from)', 'i'), message.currencySubtract, {db: usersDb});
	});
	discord.registerMessage(/./i, message.cleverbotAsk, {cleverbot: cleverbot});
}