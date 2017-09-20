"use strict";

const Datastore = require('nedb');
const path = require('path');
const isInvalidPath = require('is-invalid-path');

module.exports = class Data {
	constructor(dataPath, callback){
		let self = this;
		if(isInvalidPath(dataPath)){
			return callback('The path provided is invalid');
		}
		//Resolve the path removing any relative pathing
		let normalizedPath = path.resolve(dataPath);
		//Check path to prevent canonicalization
		if(normalizedPath.indexOf(path.resolve('src/..')) === -1) {
			return callback('Can not save data above execution directory');
		}
		self.path = normalizedPath;
		self.dataType = null;

		//bind the callback to 'this' so it can be modified in its callback
		if(callback){
			callback = callback.bind(self);
		}
		//Create Datastore
		self.db = new Datastore({filename: self.path, autoload: true, onload: callback});
	}

	set(data, callback){
		let self = this;
		if(self.dataType !== null && !(data instanceof self.dataType)){
			return callback('Cannot set parameter of this type');
		}
		self.db.findOne({_id: data._id}, function(err, doc){
			if(err || doc === null){
				return self.db.insert(data, callback);
			}
			return self.db.update(doc, data, {multi: false, returnUpdatedDocs: true}, function(err, count, newDoc){
				return callback(err, newDoc);
			});
		});
	}

	get(data, callback){
		let self = this;
		//TODO: is there a way to check if the DB has been corrupted?
		self.db.findOne(data, function(err, doc){
			if(err){
				return callback(err);
			}
			if(self.dataType !== null){
				doc = new (self.dataType)(doc);
			}
			return callback(err, doc);
		});
	}
}