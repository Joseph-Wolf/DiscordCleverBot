"use strict";

const Datastore = require('nedb');
const Data = require('./data.js');

class Users extends Data {
	constructor(dbPath, callback){
		super(dbPath);
	}
	addCurrency(amount, user){		
	}
	subtractCurrency(amount, user){
	}
}

module.exports = Users;