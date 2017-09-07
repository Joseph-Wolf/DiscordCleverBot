"use strict";

const Datastore = require('nedb');
const Data = require('./data.js');
const Setting = require('../class/setting.js');
const idFieldName = 'name';

module.exports = class Settings extends Data {
	constructor(dbPath, callback){
		super(dbPath, function(err){
			if(err){
				return callback(err);
			} else {
				let self = this;
				self.db.ensureIndex({fieldName: idFieldName}, callback);
			}
		});
		let self = this;
		self.dataType = Setting;
	}
}