# DiscordCleverBot

## Usage
It runs using Node.js
	`Node Index.js`

## Tools
This application requires the following API keys which can be modified via the private.json:

1. [Discord](https://discordapp.com/developers/applications/me)
2. [Cleverbot](https://www.cleverbot.com/api/)

## NPM dependencies

1. [discord.js](https://github.com/hydrabolt/discord.js)
2. [cleverbot](https://github.com/dtesler/node-cleverbot)
3. [cron](https://github.com/kelektiv/node-cron)

## Development
These items may be useful during development

1. [Discord.js documentation](https://discord.js.org/#/docs)
2. [free Node.js hosting services](https://www.heroku.com)
	* The Prodfile is only used for Heroku

## Tips for myself later when I forget
To keep from publishing the private.json file you can use

`git update-index --assume-unchanged FILE_NAME`

then to publish it again use:

`git update-index --no-assume-unchanged FILE_NAME`

This will keep your secrets safe!