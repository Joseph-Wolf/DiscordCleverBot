"use strict";

const Datastore = require('nedb');
const Data = require('./data.js');
const Setting = require('./class/setting.js');

module.exports = class Settings extends Data {
	constructor(dbPath, callback){
		super(dbPath, callback);
		let self = this;
		self.dataType = Setting;
	}
}