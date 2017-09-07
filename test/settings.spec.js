"use strict";

const assert = require('assert');
const fs = require('fs');
const rimraf = require('rimraf');
const path = require('path');
const getRandomString = require('../src/util/getRandomString.js');
const setting = require('../src/class/setting.js');
const data = require('../src/db/settings.js');
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
			assert.equal(db.dataType, setting);
		});
	});
	after(function(){
		if(fs.existsSync(tmpDataPath)) {
			rimraf.sync(tmpDataPath);
		}
	});
});