"use strict";

const assert = require('assert');
const randomString = require('random-string');
const testUtils = require('../testUtils.js');
const registerCleverbot = require('../../src/init/registerCleverbot.js');

describe('registerCleverbot', function(){
	before(testUtils.dbBefore);
	it('should attempt to get key from db', function(done){
		let mockCleverbot = {
			DBKey: randomString(),
			authenticate: function(value, callback){
				assert.equal(value.user, null);
				assert.equal(value.pass, null);
				return done();
			}
		};
		return testUtils.dbExecute(function(err, collection){
			if(err){
				return done(err);
			}
			return registerCleverbot(collection, mockCleverbot)
		});
	});
	it('should get key from db', function(done){
		let expectedPass = randomString();
		let expectedUser = randomString();
		let mockCleverbot = {
			DBKey: randomString(),
			authenticate: function(value, callback){
				assert.equal(value.user, expectedUser);
				assert.equal(value.pass, expectedPass);
				return done();
			}
		};
		return testUtils.dbExecute(function(err, collection){
			if(err){
				return done(err);
			}
			return collection.insert({value: {user: expectedUser, pass: expectedPass}, key: mockCleverbot.DBKey}, null, function(err){
				if(err){
					return done(err);
				}
				return registerCleverbot(collection, mockCleverbot)
			})
		});
	});
	after(testUtils.dbAfter);
});