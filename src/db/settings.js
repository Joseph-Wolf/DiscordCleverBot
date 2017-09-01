"use strict";

const Datastore = require('nedb');
const Data = require('./data.js');
const idFieldName = 'name';

class Settings extends Data {
	constructor(dbPath, callback){
		super(dbPath);
		let self = this;
		self.db.ensureIndex({fieldName: idFieldName}, callback);
	}
}

module.exports = Settings;