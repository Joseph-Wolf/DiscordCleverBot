"use strict";

const registerCleverbot = require('./init/registerCleverbot.js');
const registerDiscordbot = require('./init/registerDiscordbot.js');
const registerBotIsPlaying = require('./init/registerBotIsPlaying.js');

module.exports = function(db, discord, cleverbot, config){
	registerCleverbot(db, cleverbot);
	registerDiscordbot(db, discord, cleverbot);
	registerBotIsPlaying(discord, config.botIsPlaying);
};