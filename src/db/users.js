"use strict";

const Datastore = require('nedb');
const Data = require('./data.js');
const User = require('../class/user.js');

module.exports = class Users extends Data {
	constructor(dbPath, callback){
		super(dbPath, callback);
		let self = this;
		self.dataType = User;
	}
}