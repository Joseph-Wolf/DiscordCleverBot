"use strict";

module.exports = function(discord, db, currencyName){
	discord.registerMessage(new RegExp('[\\d]+[\\s]+' + currencyName + '[s]?[\\s]+(to)','i'), function(err, message){
		if(err){
			return message.reply(err);
		}
		let amount = parseInt(message.cleanContent.match(/[\d]+/));
		let user = message.mentions.users[0];
		usersDb.addCurrency(amount, user);
		//TODO: update db record
		return message.reply('I gave ' + amount + ' to ' + user);
	});
}