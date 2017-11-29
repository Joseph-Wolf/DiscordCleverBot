"use strict";

const choose = require('../messages/choose.js');
const showMe = require('../messages/showMe.js');
const coinFlip = require('../messages/coinFlip.js');
const getFact = require('../messages/getFact.js');
const cleverbotLogin = require('../messages/cleverbot/login.js');
const cleverbotAsk = require('../messages/cleverbot/ask.js');
const currencySetName = require('../messages/currency/setName.js');
const currencyAdd = require('../messages/currency/add.js');
const currencySubtract = require('../messages/currency/subtract.js');
const currencyBallance = require('../messages/currency/ballance.js');
const CurrencyNameSettingKey = 'CurrencyName';
const CurrencyNameDefaultValue = 'Crystal';

module.exports = function registerMessages(db, discord, cleverbot){
	discord.clearMessages();
	discord.registerMessage(/show me/i, showMe);
	discord.registerMessage(/choose/i, choose);
	discord.registerMessage(/flip a coin/i, coinFlip);
	discord.registerMessage(/fact[s]? about/i, getFact);
	discord.registerMessage(/(auth|login).+?cleverbot/i, cleverbotLogin, {cleverbot: cleverbot, db: db});
	discord.registerMessage(/currency.+?name/i, currencySetName, {db: db, key: CurrencyNameSettingKey, registerMessagesCallback: function(){
		registerMessages(db, discord, cleverbot);
	}});
	db.find({key: CurrencyNameSettingKey}).limit(1).toArray(function(err, items){
		let currencyName = CurrencyNameDefaultValue;
		if(err){
			console.log(err);
		}
		if(items !== null && items !== null && items[0] !== null && items[0] !== undefined && items[0].value !== null && items[0].value !== undefined){
			currencyName = items[0].value;
		}
		//Register currency commands
		discord.registerMessage(/bal.+?of/i, currencyBallance, {db: db, currencyName: currencyName});
		discord.registerMessage(new RegExp('[\\d]+[\\s]+' + currencyName + '[s]?[\\s]+(to)','i'), currencyAdd, {db: db, currencyName: currencyName});
		discord.registerMessage(new RegExp('[\\d]+[\\s]+' + currencyName + '[s]?[\\s]+(from)', 'i'), currencySubtract, {db: db, currencyName: currencyName});
		discord.registerMessage(/./i, cleverbotAsk, {cleverbot: cleverbot}); //This needs to be added last
	});
}