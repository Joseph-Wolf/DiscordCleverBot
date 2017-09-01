const discord = require('./src/discordbot.js');
const cleverbot = require('./src/cleverbot.js');
const config = require('./config.json');
const Settings = require('./src/db/settings.js');
const BotIsPlaying = require('./src/botIsPlaying.js');
const settingsDb = new Settings('data/settings');
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

		let client = discord.client;

		//Register bot actions
		client.on('message', message => { //Handle messages directed to bot
			let content = message.cleanContent.trim() //trim any excess spaces and make it a happy string
			let authorIsNotBot = message.author.id !== client.user.id; //is the author the bot? don't want infinite loops
			let botIsMentioned = message.mentions.users.has(client.user.id); //is the bot mentioned?
			if (authorIsNotBot && botIsMentioned) { //send cleaned message to cleverbot
				if(/show me/i.test(content)) {
					action.showMe(message);
				} else if(/choose/i.test(content)) {
					action.choose(message);
				} else if(/flip a coin/i.test(content)) {
					action.coinFlip(message)
				} else if(/fact[s]? about/i.test(content)) {
					action.getFact(message);
				} else {
					cleverbot.ask(message.cleanContent.trim(), message.reply);
				}
			}
		});

		client.on('guildMemberAdd', m =>  m.guild.defaultChannel.sendMessage(`Welcome to ${m.guild.name} ${m.user.username}!!!`)); //Message to display when adding a member

		//Register new bot is playing
		new BotIsPlaying(config.BotIsPlaying.TicksPerMinute, config.BotIsPlaying.StartOnLoad, config.BotIsPlaying.Options, client.user.setGame);
	});
});