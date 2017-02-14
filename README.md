# DiscordCleverBot

## Usage
It runs using Node.js
	`Node Index.js`

## Tools
This application requires the following API keys which can be modified via the config.json:
1. Discord
2. Cleverbot

NPM dependencies include:
1. discord.js
		* [Discord.js](https://github.com/hydrabolt/discord.js)
2. cleverbot-node
		* [Cleverbot](https://github.com/dtesler/node-cleverbot)
3. cron
		* [Cron](https://github.com/kelektiv/node-cron)

The following URLs might be useful for development:
1. [Discord Applications](https://discordapp.com/developers/applications/me)
		* Discord apps
2. [Cleverbot API](https://www.cleverbot.com/api/)
		* Cleverbot account
3. [Discord.js Guide](https://discord.js.org/#/docs/main/stable/general/welcome)
		* Discord.js documentation
4. [Heroku](https://www.heroku.com)
		* free Node.js hosting services


To keep from publishing the private.json file you can use
git update-index --assume-unchanged FILE_NAME
then to publish it again use:
git update-index --no-assume-unchanged FILE_NAME

This will keep your secrets safe!