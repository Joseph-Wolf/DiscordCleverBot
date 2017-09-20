const config = require('./config.json');

const DiscordClass = require('./src/discordbot.js');
const discord = new DiscordClass();

const CleverbotClass = require('./src/cleverbot.js');
const cleverbot = new CleverbotClass();

const Settings = require('./src/db/settings.js');
const settingsDb = new Settings('data/settings');

const Users = require('./src/db/users.js');
const usersDb = new Users('data/users');

const registerCleverbot = require('./src/init/registerCleverbot.js');
const registerDiscordbot = require('./src/init/registerDiscordbot.js');

registerCleverbot(settingsDb, cleverbot);
registerDiscordbot(settingsDb, discord, cleverbot, usersDb, config);