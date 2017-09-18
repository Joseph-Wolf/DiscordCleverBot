"use strict";

module.exports = function(discord, db, currencyName){
	discord.registerMessage(new RegExp('[\\d]+[\\s]+' + currencyName + '[s]?[\\s]+(from)', 'i'), function(err, message){
		if(err){
			return message.reply(err);
		}
		let amount = parseInt(message.cleanContent.match(/[\d]+/));
		let user = message.mentions.users[0];
		//TODO: update user in the db
		return message.reply('I took ' + amount + ' to ' + user);
	});
}