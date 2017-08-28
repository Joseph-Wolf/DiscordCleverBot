const assert = require('assert');
const fs = require('fs');
const rimraf = require('rimraf');
const path = require('path');
var data = require('../src/db/data.js');
var tmpDataPath = path.join('test','tmp');

function generateDataFilePath(){
  var max = 999999999;
  var min = 1;
  var random = Math.floor(Math.random() * (max - min + 1)) + min;
  return path.join(tmpDataPath, random.toString());
}

before(function() {
  if (!fs.existsSync(tmpDataPath)){
    fs.mkdirSync(tmpDataPath);
  }
});

describe('Data', function() {
  describe('constructor', function() {
    it('should create an object', function() {
      var db = new data();
      assert.ok(db);
    });
    it('should create a file', function(done){
      var tmpPath = generateDataFilePath();
      var db = new data(tmpPath, function(err){
        if (err) {
          done(err);
        } else {
          assert.ok(fs.existsSync(tmpPath));
          done();
        }
      });
    });
    it('should prevent canonicalization', function(){
      var tmpPath = '../boop';
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
      var tmpPath = generateDataFilePath();
      var db = new data(tmpPath);
      assert.equal(db.path, path.resolve(tmpPath));
    });
  });
});

after(function() {
  if (fs.existsSync(tmpDataPath)){
    rimraf.sync(tmpDataPath);
  }
});