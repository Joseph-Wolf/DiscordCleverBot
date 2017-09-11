"use strict";

module.exports = function(discord){
	discord.registerMessage(/choose/i, function(err, message){
		if(err){
			return message.reply("I can't choose!");
		}
		let trimmedContent = message.cleanContent.split(/choose/i)[1].trim();
		let response = action.choose(trimmedContent);
		return message.reply('I choose ' + response);
	});
}