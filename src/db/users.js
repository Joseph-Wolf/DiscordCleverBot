"use strict";

const Datastore = require('nedb');
const Data = require('./data.js');

module.exports = class Users extends Data {
	constructor(dbPath, callback){
		super(dbPath);
	}
	addCurrency(amount, user){		
	}
	subtractCurrency(amount, user){
	}
}