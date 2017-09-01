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
		it('should create an object', function() {
			let db = new data();
			assert.ok(db);
		});
		it('should create a file', function(done){
			let tmpPath = generateDataFilePath();
			let db = new data(tmpPath, function(err){
				assert.ok(fs.existsSync(tmpPath));
				if (err) {
					done(err);
				} else {
					done();
				}
			});
		});
		it('should prevent canonicalization', function(){
			let tmpPath = '../boop';
			try {
				new data(tmpPath);
				assert.ok(false); //should fail if no exception was thrown
			} catch(e) {
				assert.ok(true); //should pass if exception was thrown
			}
		});
	});
	describe('path', function(){
		it('should return passed path', function(){
			let tmpPath = generateDataFilePath();
			let db = new data(tmpPath);
			assert.equal(db.path, path.resolve(tmpPath));
		});
	});
	describe('set/get', function(){
		it('should set and retrieve a record', function(done){
			let db = new data(generateDataFilePath());
			let keyString = getRandomString();
			let valueString = getRandomString();
			let record = {key: keyString, value: valueString};
			db.set(record);
			db.get({key: record.key}, function(item){
				assert.equal(item.key, record.key);
				assert.equal(item.value, record.value);
				done();
			});
		});
	});
	after(function(){
		if (fs.existsSync(tmpDataPath)){
			rimraf.sync(tmpDataPath);
		}
	});
});