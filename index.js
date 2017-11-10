const Datastore = require('nedb');
const config = require('./config.json');
const Discordbot = require('./src/discordbot.js');
const Cleverbot = require('./src/cleverbot.js');
const init = require('./src/init.js');

init(new Datastore({filename: 'data', autoload: true}), new Discordbot(), new Cleverbot(), config);