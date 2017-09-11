"use strict";

module.exports = function(discord, currencyName){
	discord.registerMessage(new RegExp('[\\d]+[\\s]+' + currencyName + '[s]?[\\s]+(from)', 'i'), function(err, message){
		if(err){
			return message.reply(err);
		}
		let amount = parseInt(message.cleanContent.match(/[\d]+/));
		let user = message.mentions.users[0];
		usersDb.subtractCurrency(amount, user);
		return message.reply('I took ' + amount + ' to ' + user);
	});
}