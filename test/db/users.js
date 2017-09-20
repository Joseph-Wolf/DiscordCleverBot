"use strict";

const assert = require('assert');
const fs = require('fs');
const rimraf = require('rimraf');
const path = require('path');
const data = require('../../src/db/users.js');
const getRandomString = require('../../src/util/getRandomString.js');
const User = require('../../src/db/class/user.js');
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
			assert.equal(db.dataType, User);
		});
	});
	describe('set/get', function(){
		it('should return a user for a get that does not exist', function(done){
			let db = new data(generateDataFilePath());
			let user = new User({name: getRandomString()});
			db.get(user, function(err, doc){
				if(err){
					return done(err);
				}
				assert.ok(doc);
				assert.ok(doc instanceof User);
				assert.equal(user.name, doc.name);
				return done();
			});
		});
		it('should get, set, and update a user', function(done){
			let db = new data(generateDataFilePath());
			let user = new User({name: getRandomString(), money: 0});
			db.set(user, function(err, newDoc){
				if(err){
					return done(err);
				}
				db.get({_id: newDoc._id}, function(err, doc){
					if(err){
						return done(err);
					}
					let initial = 5;
					let subtract = 4;
					let expected = initial - subtract;
					doc.addMoney(initial);
					doc.subtractMoney(subtract, function(err, ballance){
						if(err){
							return done(err);
						}
						assert.equal(expected, doc.money);
						db.set(doc, function(err, newDoc){
							if(err){
								return done(err);
							}
							assert.equal(expected, newDoc.money);
							return done();
						});
					});
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