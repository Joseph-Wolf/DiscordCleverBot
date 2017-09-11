"use strict";

module.exports = function(discord){
	discord.registerMessage(/show me/i, function(err, message){
		if(err){
			return message.reply(err);
		}
		let trimmedContent = message.cleanContent.split(/show me/i)[1].trim();
		let response = action.showMe(trimmedContent, function(err, image){
			if(err){
				return message.reply(err);
			}
			return message.reply(image);
		});
	});
}