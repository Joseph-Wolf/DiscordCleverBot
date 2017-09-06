"use strict";

const Datastore = require('nedb');
const Data = require('./data.js');
const idFieldName = 'name';

module.exports = class Settings extends Data {
	constructor(dbPath, callback){
		super(dbPath, function(err){
			if(err === null){
				let self = this;
				self.db.ensureIndex({fieldName: idFieldName}, callback);
			} else {
				callback(err);
			}
		});
	}
}