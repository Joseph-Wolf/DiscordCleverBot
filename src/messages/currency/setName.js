"use strict";

const Setting = require('../../db/class/setting.js');

module.exports = function(err, callback, params){
	if(err || params === null || params === undefined || params.text === null || params.text === undefined || params.text.trim() === '' || params.db === null || params.db === undefined || params.key === null || params.key === undefined){
		return callback('Unable to set the name of the currency');
	}
	let text = params.text.trim();
	let db = params.db;
	let key = params.key;

	let value = text.match(/[\S]+$/)[0];

	db.get({key: key}, function(err, doc){
		if(err){ //Did not find the setting. Make a new one
			doc = new Setting({key: key});
		}
		doc.value = value;
		db.set(doc, function(err, doc){
			if(err){
				return callback('Failed to update currency name in the database');
			}
			return callback(null, 'Success!!!');
		});
	})
};