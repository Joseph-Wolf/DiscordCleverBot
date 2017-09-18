"use strict";

module.exports = function(discord, db, currencyName){
	discord.registerMessage(new RegExp('[\\d]+[\\s]+' + currencyName + '[s]?[\\s]+(to)','i'), function(err, message){
		if(err){
			return message.reply(err);
		}
		let amount = parseInt(message.cleanContent.match(/[\d]+/));
		let user = message.mentions.users[0];
		//construct the user object

		//Get the user from the DB
		db.get(user, function(err, doc){
			if(err){
				return message.reply('I encountered an error giving money to user');
			}
			//Add the money to the retrieved user
			doc.addMoney(amount);
			//Update the user
			db.set(doc, function(err, doc){
				if(err){
					return message.reply('I encountered an error giving money to user');
				}
				return message.reply('I gave ' + amount + ' to ' + user);
			});
		});
	});
}