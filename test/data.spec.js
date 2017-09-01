const assert = require('assert');
const fs = require('fs');
const rimraf = require('rimraf');
const path = require('path');
const getRandomString = require('../src/util/getRandomString.js');
var data = require('../src/db/data.js');
var tmpDataPath = path.join('test','data');

function generateDataFilePath(){
  return path.join(tmpDataPath, getRandomString());
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
        assert.ok(fs.existsSync(tmpPath));
        if (err) {
          done(err);
        } else {
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
  describe('set/get', function(){
    it('should set and retrieve a record', function(done){
      var db = new data(generateDataFilePath());
      var keyString = getRandomString();
      var valueString = getRandomString();
      var record = {key: keyString, value: valueString};
      db.set(record);
      db.get({key: record.key}, function(item){
        assert.equal(item.key, record.key);
        assert.equal(item.value, record.value);
        done();
      });
    });
  });
});