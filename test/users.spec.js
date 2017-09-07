"use strict";

const assert = require('assert');
const fs = require('fs');
const rimraf = require('rimraf');
const path = require('path');
const data = require('../src/db/users.js');
const user = require('../src/class/user.js');
const getRandomString = require('../src/util/getRandomString.js');
const tmpDataPath = path.join('test','data');

function generateDataFilePath(){
	return path.join(tmpDataPath, getRandomString());
}

describe('users', function(){
	describe('constructor', function(){
		it('should return an object', function(done){
			assert.ok(new data(generateDataFilePath(), done));
		});
		it('should set dataType', function(done){
			let db = new data(generateDataFilePath(), done);
			assert.equal(db.dataType, user);
		});
	});
	after(function(){
		if (fs.existsSync(tmpDataPath)){
			rimraf.sync(tmpDataPath);
		}
	});
});