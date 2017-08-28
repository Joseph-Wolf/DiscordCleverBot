"use strict";

const Datastore = require('nedb');
const Data = require('./data.js');
const Setting = require('../class/setting.js');
const dbName = 'settings';
const idFieldName = 'name';

class Settings extends Data {
	constructor(callback){
		super(dbName, function(){
			let self = this;
			//Index the setting names. There should not be duplicate setting names
			self.db.ensureIndex({fieldName: idFieldName}, function(err){
				if(err !== null){
					throw new Error('Error setting up the Settings DB: ' + err);
				}
			});
			callback();
		});
	}
}

module.exports = Settings;