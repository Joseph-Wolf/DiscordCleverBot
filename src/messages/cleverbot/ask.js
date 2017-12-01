"use strict";

const betterCleverbotIO = require('better-cleverbot-io');

function validate(params, callback){
	if(params === null || params === undefined){
		console.error('null or undefined params.');
		return callback('Invalid parameters passed to ask function.');
	}
	if(params.text === null || params.text === undefined){
		console.error('null or undefined text.');
		return callback('Invalid parameters passed to ask function.');
	}
	if(params.db === null || params.db === undefined){
		console.error('null or undefined db.');
		return callback('Invalid parameters passed to ask function.');
	}
	if(params.key === null || params.key === undefined){
		console.error('null or undefined key.');
		return callback('Invalid parameters passed to ask function.');
	}
	return callback(null);
}

function validateSetting(items, callback){
	if(items === null || items === undefined || items.length === 0){
		console.info('No credentials were found in the DB');
		return callback('Please set up credentials for Cleverbot feature.');
	}
	if(items[0].value === null || items[0].value === undefined){
		console.error('Cleverbot value is null or undefined');
		return callback('Invalid Cleverbot credentials were used. Please try setting them again.');
	}
	if(items[0].value.user === null || items[0].value.user === undefined){
		console.error('Cleverbot user is null or undefined');
		return callback('Invalid Cleverbot credentials were used. Please try setting them again.');
	}
	if(items[0].value.key === null || items[0].value.key === undefined){
		console.error('Cleverbot key is null or undefined');
		return callback('Invalid Cleverbot credentials were used. Please try setting them again.');
	}
	return callback(null);
}

function getCleverbotCredentials(db, key, callback){
	return db.find({key: key}).limit(1).toArray(callback);
}

function cleanResponse(dirtyResponse){
	if(dirtyResponse === null || dirtyResponse === undefined){
		return 'What do you mean?';
	}
	return dirtyResponse;
}

module.exports = function(err, params, callback){
	if(err){
		console.error(err);
		return callback('I encountered an error asking cleverbot.');
	}
	return validate(params, function(err){
		if(err){
			return callback(err);
		}
		let db = params.db;
		let key = params.key;
		let text = params.text;

		let cleverbot = (params.cleverbot || betterCleverbotIO);

		return getCleverbotCredentials(db, key, function(err, items){
			if(err){
				console.error(err);
				return callback('Please set up credentials for Cleverbot feature.');
			}
			return validateSetting(items, function(err){
				if(err){
					return callback(err);
				}
				let bot = new cleverbot(items[0].value);
				return bot.create().then(() => {
					return bot.ask(text).then(response => {
						return callback(null, cleanResponse(response));
					}).catch(err => {
						console.error(err);
						return callback('I am broken... (XuX)');
					});
				}).catch(err => {
					console.error(err);
					return callback('Invalid Cleverbot credentials were used. Please try setting them again.');
				});
			});
		});

		return cleverbot.ask(text, callback);
	});
}