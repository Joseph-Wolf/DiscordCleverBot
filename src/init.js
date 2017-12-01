"use strict";

const registerDiscordbot = require('./init/registerDiscordbot.js');
const registerBotIsPlaying = require('./init/registerBotIsPlaying.js');

module.exports = function(db, discord, config){
	registerDiscordbot(db, discord);
	registerBotIsPlaying(discord, config.botIsPlaying);
};