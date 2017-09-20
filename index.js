const CronJob = require('cron').CronJob;
const DiscordClass = require('./src/discordbot.js');
const CleverbotClass = require('./src/cleverbot.js');
const getConsoleInput = require('./src/util/getConsoleInput.js');
const config = require('./config.json');
const Settings = require('./src/db/settings.js');
const Users = require('./src/db/users.js');
const Setting = require('./src/db/class/settings.js');
const choose = require('./src/util/choose.js');
const message = {
	choose: require('./src/messages/choose.js'),
	showMe: require('./src/messages/showMe.js'),
	coinFlip: require('./src/messages/coinFlip.js'),
	getFact: require('./src/messages/getFact.js'),
	cleverbotLogin: require('./src/messages/cleverbotLogin.js'),
	cleverbotAsk: require('./src/messages/cleverbotAsk.js'),
	currencyAdd: require('./src/messages/currencyAdd.js'),
	currencySubtract: require('./src/messages/currencySubtract.js')
};

const discord = new DiscordClass();
const cleverbot = new CleverbotClass();
const settingsDb = new Settings('data/settings');
const usersDb = new Users('data/users');

//Register new bot is playing
let BotIsPlaying = new CronJob({ //A job that changes the game the bot is playing periodically
	cronTime: `*/${config.BotIsPlaying.TicksPerMinute} * * * *`,
	onTick: function(){
		discord.client.user.setGame(action.choose(config.BotIsPlaying.Options));
	},
	start: false //Don't start it here
});

//Register commands with the discord bot
discord.registerMessage(/show me/i, message.showMe);
discord.registerMessage(/choose/i, message.choose);
discord.registerMessage(/flip a coin/i, message.coinFlip);
discord.registerMessage(/fact[s]? about/i, message.getFact);
discord.registerMessage(/(auth|login).+?cleverbot/i, message.cleverbotLogin);

//Welcome Users
settingsDb.get({key: 'WelcomeUsers'}, function(err, doc){
	if(err){
		return;
	}
	if(doc === null){
		return discord.welcomeUsers(false);
	}
	return discord.welcomeUsers(true);
});

//Get Currency
settingsDb.get({key: 'CurrencyName'}, function(err, doc){
	if(err){
		return;
	}
	if(doc === null){ //set default currency if one is not provided
		doc.value = 'onion';
	}
	let CurrencyName = doc.value;
	//Register currency commands
	discord.registerMessage(new RegExp('[\\d]+[\\s]+' + CurrencyName + '[s]?[\\s]+(to)','i'), message.currencyAdd, {db: usersDb});
	discord.registerMessage(new RegExp('[\\d]+[\\s]+' + CurrencyName + '[s]?[\\s]+(from)', 'i'), message.currencySubtract, {db: usersDb});
});

//Register cleverbot
settingsDb.get({key: 'CleverbotToken'}, function(err, doc){
	if(err || doc === null || doc.user === null || doc.value === null) {
		return;
	}
	return cleverbot.authenticate(credentials, function(err, accepted){
		if(err){
			return console.log('rejected cleverbot credentials');
		}
		settingsDb.set(new Setting({key: 'CleverbotToken', value: accepted}));
		return console.log('accepted cleverbot credentials');
	});
});

//Register Discord
function authenticateDiscordWithKey(key, callback){
	discord.authenticate(key, function(err, accepted){
		if(err){ //Loop until valid credentials are passed
			return getConsoleInput('Discord Bot Key > ', function(answer) {
				return authenticateDiscordWithKey(answer, callback); //Loop until valid
			});
		}
		return callback(null, accepted);
	});
}
settingsDb.get({key: 'DiscordToken'}, function(err, doc){
	if(err || doc === null) {
		doc = {value: null};
	}
	return authenticateDiscordWithKey(doc.value, function(err, key){
		if(err){
			return console.log('rejected Discord key');
		}
		settingsDb.set(new Setting({key: 'DiscordToken', value: key}));
		if(config.BotIsPlaying.StartOnLoad){
			BotIsPlaying.start();
		}
		//Match all other cases to cleverbot
		discord.registerMessage(/./i, message.cleverbotAsk, {cleverbot: cleverbot});
		return console.log('accepted Discord key');
	});
});