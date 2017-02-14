const Discord = require('discord.js');
const Cleverbot = require('cleverbot-node');
const CronJob = require('cron').CronJob;
const config = require('./config.json');

const client = new Discord.Client();
const cleverbot = new Cleverbot;

client.on('ready', () => { //display message to the console when up and running
	console.log('I am ready!');
});

client.on('message', message => { //Handle messages directed to bot
	var content = message.cleanContent.trim() //trim any excess spaces and make it a happy string
	var authorIsNotBot = message.author.id !== client.user.id; //is the author the bot? don't want infinite loops
	var botIsMentioned = message.mentions.users.has(client.user.id); //is the bot mentioned?
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

function askCleverbot(message){
	Cleverbot.prepare(function prepareCleverbot(){
		cleverbot.write(message.cleanContent.trim(), function askCleverbot(response) {
			message.reply(response.message);
		});
	});
}

function choose(message) {
	var listOfObjects = message.cleanContent.split(/choose/i)[1].split(',');
	var numberOfObjectsToChooseFrom = listOfObjects.length;
	message.reply('I choose ' + listOfObjects[getRandomInt(0, numberOfObjectsToChooseFrom)]);
}

function showMe(message) {
	var desiredCategory = message.cleanContent.split(/show me/i)[1].trim()
	var randomSizes = [100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600];
	var availableCategories = ['abstract', 'animals', 'cats', 'city', 'food', 'nature'];
	var width = randomSizes[getRandomInt(0, randomSizes.length)];
	var height = randomSizes[getRandomInt(0, randomSizes.length)];
	var urlParts = [width, height, desiredCategory];

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
		var listSize = config.BotIsPlaying.Options.length;
		client.user.setGame(config.BotIsPlaying.Options[getRandomInt(0, listSize)]);
	},
	start: config.BotIsPlaying.StartOnLoad
});

//configure the cleverbot api key
cleverbot.configure({"botapi":config.Cleverbot.APIKey});

//Login and start the bot
client.login(config.Discord.Token);