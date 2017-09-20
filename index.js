const config = require('./config.json');
const Discordbot = require('./src/discordbot.js');
const Cleverbot = require('./src/cleverbot.js');
const SettingsDb = require('./src/db/settings.js');
const UsersDb = require('./src/db/users.js');
const init = require('./src/init.js');

init(new SettingsDb('data/settings'), new UsersDb('data/users'), new Discordbot(), new Cleverbot(), config);