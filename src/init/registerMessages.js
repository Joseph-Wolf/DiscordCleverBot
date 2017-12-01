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

module.exports = function registerMessages(db, discord, currencyNameSettingKey, currencyNameDefaultValue, cleverbotSettingKey, callback){
	discord.clearMessages();
	discord.registerMessage(/show me/i, showMe);
	discord.registerMessage(/choose/i, choose);
	discord.registerMessage(/flip a coin/i, coinFlip);
	discord.registerMessage(/fact[s]? about/i, getFact);
	discord.registerMessage(/(auth|login).+?cleverbot/i, cleverbotLogin, {db: db, key: cleverbotSettingKey});
	discord.registerMessage(/currency.+?name/i, currencySetName, {db: db, key: currencyNameSettingKey, registerMessagesCallback: function(){
		registerMessages(db, discord);
	}});
	db.find({key: currencyNameSettingKey}).limit(1).toArray(function(err, items){
		if(err){
			console.log(err);
			return callback('Error reading currencyName from the database');
		}
		let currencyName = currencyNameDefaultValue;
		if(items !== null && items !== null && items[0] !== null && items[0] !== undefined && items[0].value !== null && items[0].value !== undefined){
			currencyName = items[0].value;
		}
		//Register currency commands
		discord.registerMessage(/bal.+?of/i, currencyBallance, {db: db, currencyName: currencyName});
		discord.registerMessage(new RegExp('[\\d]+[\\s]+' + currencyName + '[s]?[\\s]+(to)','i'), currencyAdd, {db: db, currencyName: currencyName});
		discord.registerMessage(new RegExp('[\\d]+[\\s]+' + currencyName + '[s]?[\\s]+(from)', 'i'), currencySubtract, {db: db, currencyName: currencyName});
		discord.registerMessage(/./i, cleverbotAsk, {db: db, key: cleverbotSettingKey}); //This needs to be added last
	});
}