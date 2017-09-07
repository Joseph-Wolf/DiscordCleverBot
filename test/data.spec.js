"use strict";

const assert = require('assert');
const fs = require('fs');
const rimraf = require('rimraf');
const path = require('path');
const getRandomString = require('../src/util/getRandomString.js');
const data = require('../src/db/data.js');
const tmpDataPath = path.join('test','data');

function generateDataFilePath(){
	return path.join(tmpDataPath, getRandomString());
}

describe('Data', function() {
	describe('constructor', function() {
		it('should create an object', function(done) {
			let db = new data(generateDataFilePath(), done);
			assert.ok(db);
		});
		it('should create a file', function(done){
			let tmpPath = generateDataFilePath();
			let db = new data(tmpPath, function(err){
				if (err) {
					done(err);
				} else {
					assert.ok(fs.existsSync(tmpPath));
					done();
				}
			});
		});
		it('should prevent canonicalization', function(done){
			let tmpPath = '../boop';
			new data(tmpPath, function(err){
				if(err){
					done();
				} else {
					done('Database was created');
				}
			});
		});
	});
	describe('path', function(){
		it('should return passed path', function(done){
			let tmpPath = generateDataFilePath();
			let db = new data(tmpPath, done);
			assert.equal(db.path, path.resolve(tmpPath));
		});
	});
	describe('set/get', function(){
		it('should set and retrieve a record', function(done){
			let db = new data(generateDataFilePath());
			let keyString = getRandomString();
			let valueString = getRandomString();
			let record = {key: keyString, value: valueString};
			db.set(record, function(err, newDoc){
				if(err){
					return done(err);
				}
				db.get({key: record.key}, function(err, doc){
					if(err){
						return done(err);
					} else {
						assert.equal(doc.key, record.key);
						assert.equal(doc.value, record.value);
						return done();
					}
				});
			});
		});
		it('should not set if object does not match dataType', function(done){
			class one {
				constructor(val){
					this._id;
					this.field1 = val;
				}
			}
			class two {
				constructor(val){
					this._id;
					this.field2 = val;
				}
			}
			let db = new data(generateDataFilePath());
			db.dataType = one;
			db.set(new two('help'), function(err){
				if(err){
					done();
				} else {
					done('Set incorect dataType');
				}
			});
		});
		it('should return the correct dataType', function(done){
			class one {
				constructor(val){
					this._id;
					this.field1 = val;
				}
			}
			let record = new one('hello');
			let db = new data(generateDataFilePath());
			db.dataType = one;
			db.set(record, function(err){
				if(err) {
					return done(err);
				}
				db.get(record, function(err, doc){
					if(err){
						return done(err);
					}
					assert.ok(doc instanceof one);
					return done();
				});
			});
		});
	});
	after(function(){
		if (fs.existsSync(tmpDataPath)){
			rimraf.sync(tmpDataPath);
		}
	});
});