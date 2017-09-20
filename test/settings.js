"use strict";

const assert = require('assert');
const fs = require('fs');
const rimraf = require('rimraf');
const path = require('path');
const getRandomString = require('../src/util/getRandomString.js');
const data = require('../src/db/settings.js');
const Setting = require('../src/db/class/setting.js');
const tmpDataPath = path.join('test','data');

function generateDataFilePath(){
	return path.join(tmpDataPath, getRandomString());
}

describe('Settings', function(){
	describe('constructor', function(){
		it('should create an object', function(done) {
			let db = new data(generateDataFilePath(), done);
			assert.ok(db);
		});
		it('should name the file properly', function(done){
			let randomName = getRandomString();
			let randomPath = path.join(tmpDataPath, randomName);
			let db = new data(randomPath, done);
			assert.equal(path.basename(db.path), randomName);
		});
		it('should call the callback', function(done){
			new data(generateDataFilePath(), done);
		});
		it('should set dataType', function(done){
			let db = new data(generateDataFilePath(), done);
			assert.equal(db.dataType, Setting);
		});
	});
	describe('set/get', function(){
		it('should return a setting for a get that does not exist', function(done){
			let db = new data(generateDataFilePath());
			let setting = new Setting({key: getRandomString(), value: getRandomString()});
			db.get(setting, function(err, doc){
				if(err){
					return done(err);
				}
				assert.ok(doc);
				assert.ok(doc instanceof Setting);
				assert.equal(setting.key, doc.key);
				assert.equal(setting.value, doc.value);
				return done();
			});
		});
		it('should get, set, and update a setting', function(done){
			let db = new data(generateDataFilePath());
			let setting = new Setting({key: getRandomString(), value: getRandomString()});
			db.set(setting, function(err, newDoc){
				if(err){
					return done(err);
				}
				db.get({_id: newDoc._id}, function(err, doc){
					if(err){
						return done(err);
					}
					assert.equal(setting.key, doc.key);
					assert.equal(setting.value, doc.value);
					let newValue =  getRandomString();
					doc.value = newValue;
					db.set(doc, function(err, newDoc){
						if(err){
							return done(err);
						}
						assert.equal(newValue, newDoc.value);
						return done();
					});
				});
			});
		});
	});
	after(function(){
		if(fs.existsSync(tmpDataPath)) {
			rimraf.sync(tmpDataPath);
		}
	});
});