const assert = require('assert');
const fs = require('fs');
const rimraf = require('rimraf');
const path = require('path');
var data = require('../src/db/settings.js');
var tmpDataPath = path.join('test','tmp');

function generateString(){
  var max = 999999999;
  var min = 1;
  var random = Math.floor(Math.random() * (max - min + 1)) + min;
  return random.toString();
}

function generateDataFilePath(){
  return path.join(tmpDataPath, generateString());
}

before(function() {
  if (!fs.existsSync(tmpDataPath)){
    fs.mkdirSync(tmpDataPath);
  }
});

describe('Settings', function(){
	describe('constructor', function(){
		it('should create an object', function() {
	      var db = new data();
	      assert.ok(db);
	    });
		it('should name the file properly', function(){
			var db = new data();
			assert.equal(path.basename(db.path), 'settings');
		});
	});
});

after(function() {
  if (fs.existsSync(tmpDataPath)){
    rimraf.sync(tmpDataPath);
  }
});