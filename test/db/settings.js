"use strict";

const assert = require('assert');
const path = require('path');
const testUtils = require('../testUtils.js');
const getRandomString = require('../../src/util/getRandomString.js');
const data = require('../../src/db/settings.js');
const Setting = require('../../src/db/class/setting.js');

describe('Settings', function(){
	describe('constructor', function(){
		it('should create an object', function(done) {
			let db = new data(testUtils.generateDataFilePath(), done);
			assert.ok(db);
		});
		it('should call the callback', function(done){
			new data(testUtils.generateDataFilePath(), done);
		});
		it('should set dataType', function(done){
			let db = new data(testUtils.generateDataFilePath(), done);
			assert.equal(db.dataType, Setting);
		});
	});
	describe('set/get', function(){
		it('should return a setting for a get that does not exist', function(done){
			let db = new data(testUtils.generateDataFilePath());
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
			let db = new data(testUtils.generateDataFilePath());
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
	after(testUtils.deleteTempDataPath);
});