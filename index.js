const discord = require('./src/discordbot.js');
const cleverbot = require('./src/cleverbot.js');
const config = require('./config.json');
const Settings = require('./src/db/settings.js');
const Users = require('./src/db/users.js');
const BotIsPlaying = require('./src/botIsPlaying.js');
const settingsDb = new Settings('data/settings');
const usersDb = new Users('data/users');
const action = {
	choose: require('./src/choose.js'),
	coinFlip: require('./src/coinFlip.js'),
	getFact: require('./src/getFact.js'),
	showMe: require('./src/showMe.js')
}
const keys = {
	DiscordKey: {name: 'DiscordKey'},
	CleverbotKey: {name: 'CleverbotKey'}
}

//Start Discord
settingsDb.get(keys.DiscordKey, function(doc){
	if(doc === null) {
		doc = {value: null};
	}
	discord.authenticate(doc.value, function(acceptedKey){
		let data = keys.DiscordKey;
		data.value = acceptedKey;
		settingsDb.set(data);
		let client = discord.client;

		//Start Cleverbot
		settingsDb.get(keys.CleverbotKey, function(doc){
			if(doc === null) {
				doc = {user: null, value: null};
			}
			cleverbot.authenticate(doc.user, doc.value, function(acceptedUser, acceptedKey){
				let data = keys.CleverbotKey;
				data.user = acceptedUser;
				data.value = acceptedKey;
				settingsDb.set(data);
			});
		});

		var currency = 'onion';
		discord.registerMessage(/show me/i, function(message){
			let trimmedContent = message.cleanContent.split(/show me/i)[1].trim();
			let response = action.showMe(trimmedContent);
			message.reply(response);
		});
		discord.registerMessage(/choose/i, function(message){
			let trimmedContent = message.cleanContent.split(/choose/i)[1].trim();
			let response = action.choose(trimmedContent);
			message.reply('I choose ' + response);
		});
		discord.registerMessage(/flip a coin/i, function(message){
			let response = action.coinFlip();
			message.reply(response);
		});
		discord.registerMessage(/fact[s]? about/i, function(message){
			let trimmedContent = message.cleanContent.split(/fact[s]? about/i)[1].trim();
			let response = action.getFact(trimmedContent);
			message.reply(response);
		});
		discord.registerMessage(new RegExp('[\\d]+[\\s]+' + currency + '[s]?[\\s]+(to)','i'), function(message){
			let amount = parseInt(message.cleanContent.match(/[\d]+/));
			let user = message.mentions.users[0];
			usersDb.addCurrency(amount, user);
			message.reply('I gave ' + amount + ' to ' + user);
		});
		discord.registerMessage(new RegExp('[\\d]+[\\s]+' + currency + '[s]?[\\s]+(from)', 'i'), function(message){
			let amount = parseInt(message.cleanContent.match(/[\d]+/));
			let user = message.mentions.users[0];
			usersDb.subtractCurrency(amount, user);
			message.reply('I took ' + amount + ' to ' + user);
		});
		discord.registerMessage(/(auth|login)[\\S]+[\\s]+cleverbot/i, function(message){
			cleverbot.authenticateWithPrompt(function(acceptedUser, acceptedKey){
				let data = keys.CleverbotKey;
				data.user = acceptedUser;
				data.value = acceptedKey;
				settingsDb.set(data);
			});
		});
		//Match all other cases to cleverbot
		discord.registerMessage(/./i, function(message){
			cleverbot.ask(message); //need to call it directly due to scoping
		});

		discord.welcomeUsers(false);

		//Register new bot is playing
		new BotIsPlaying(config.BotIsPlaying.TicksPerMinute, config.BotIsPlaying.StartOnLoad, config.BotIsPlaying.Options, client);
	});
});