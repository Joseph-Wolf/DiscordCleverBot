const Discord = require('discord.js');
const CronJob = require('cron').CronJob;
const Cleverbot = require('cleverbot');
const config = require('./config.json');
const client = new Discord.Client();

let clev = new Cleverbot({
  key: config.Cleverbot.APIKey // Can be obtained at http://cleverbot.com/api 
});

client.on('ready', () => { //display message to the console when up and running
	console.log('I am ready!');
});

client.on('message', message => { //Handle messages directed to bot
	let content = message.cleanContent.trim() //trim any excess spaces and make it a happy string
	let authorIsNotBot = message.author.id !== client.user.id; //is the author the bot? don't want infinite loops
	let botIsMentioned = message.mentions.users.has(client.user.id); //is the bot mentioned?
	if (authorIsNotBot && botIsMentioned) { //send cleaned message to cleverbot
		if(/show me/i.test(content)) {
			showMe(message);
		} else if(/choose/i.test(content)) {
			choose(message);
		} else {
			askCleverbot(message);
		}
	}
});

client.on('guildMemberAdd', m =>  m.guild.defaultChannel.sendMessage(`Welcome to ${m.guild.name} ${m.user.username}!!!`)); //Message to display when adding a member

let conversationToken;
function askCleverbot(message){
	if(conversationToken) {
		clev.query(message.cleanContent.trim(), {
			cs: conversationToken
		})
		.then(function (response) {
			conversationToken = response.cs;
			message.reply(response.output);
		});
	} else {
		clev.query(message.cleanContent.trim())
		.then(function (response) {
			conversationToken = response.cs;
			message.reply(response.output);
		});
	}
	
}

function choose(message) {
	let listOfObjects = message.cleanContent.split(/choose/i)[1].split(',');
	let numberOfObjectsToChooseFrom = listOfObjects.length;
	message.reply('I choose ' + listOfObjects[getRandomInt(0, numberOfObjectsToChooseFrom)]);
}

function showMe(message) {
	let desiredCategory = message.cleanContent.split(/show me/i)[1].trim()
	let randomSizes = [100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600];
	let availableCategories = ['abstract', 'animals', 'cats', 'city', 'food', 'nature'];
	let width = randomSizes[getRandomInt(0, randomSizes.length)];
	let height = randomSizes[getRandomInt(0, randomSizes.length)];
	let urlParts = [width, height, desiredCategory];

	if(availableCategories.includes(desiredCategory.toLowerCase())) {
		message.reply('http://lorempixel.com/' + urlParts.join('/'));
	} else {
		message.reply('No. I only have pictures of ' + availableCategories.join(', '));
	}
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

new CronJob({ //A job that changes the game the bot is playing periodically
	cronTime: `*/${config.BotIsPlaying.TicksPerMinute} * * * *`,
	onTick: function changeGame() {
		let listSize = config.BotIsPlaying.Options.length;
		client.user.setGame(config.BotIsPlaying.Options[getRandomInt(0, listSize)]);
	},
	start: config.BotIsPlaying.StartOnLoad
});

//Login and start the bot
client.login(config.Discord.Token);