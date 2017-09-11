"use strict";

module.exports = function(discord){
	discord.registerMessage(/./i, function(err, message){
		if(err){
			return message.reply(err);
		}
		let phrase = message.cleanContent.trim();
		cleverbot.ask(phrase, function(err, response){
			if(err){
				return; //return no reply on errors
			}
			return message.reply(response);
		});
	});
}