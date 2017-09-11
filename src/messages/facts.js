"use strict";

module.exports = function(discord){
	discord.registerMessage(/fact[s]? about/i, function(err, message){
		if(err) {
			return message.reply(err);
		}
		let trimmedContent = message.cleanContent.split(/fact[s]? about/i)[1].trim();
		action.getFact(trimmedContent, function(err, response){
			if(err){
				return message.reply(err);
			}
			return message.reply(response);
		});
	});
}