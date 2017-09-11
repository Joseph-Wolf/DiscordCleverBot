"use strict";

module.exports = function(discord){
	discord.registerMessage(/flip a coin/i, function(err, message){
		if(err){
			return message.reply(err);
		}
		if(action.coinFlip()){
			return message.reply('Heads...');
		}
		return message.reply('Tails...');
	});
}