"use strict";

const Datastore = require('nedb');
const path = require('path');
const isInvalidPath = require('is-invalid-path');

class Data {
	constructor(dataPath, callback){
		let self = this;
		if(!isInvalidPath(dataPath)) {
			//Resolve the path removing any relative pathing
			let normalizedPath = path.resolve(dataPath);
			//Check path to prevent canonicalization
			if(normalizedPath.indexOf(path.resolve('src/..')) === -1) {
				throw new Error('Can not save data above execution directory');
			}
			//Create Datastore
			self.db = new Datastore({filename: normalizedPath, autoload: true, onload: callback});
			//Set some commonly accessed or tested parameters
			self.path = self.db.filename;
		}
	}
}

module.exports = Data;