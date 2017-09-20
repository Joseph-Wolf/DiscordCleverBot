"use strict";

const assert = require('assert');
const testUtils = require('../testUtils.js');
const data = require('../../src/db/users.js');
const getRandomString = require('../../src/util/getRandomString.js');
const currencyBallanceMessage = require('../../src/messages/currencyBallance.js');
const User = require('../../src/db/class/user.js');

describe('Currency', function(){
	describe('Message', function(){
		describe('Ballance', function(){
			it('should return sanatize error message', function(done){
				currencyBallanceMessage(true, function(err, reply){
					if(err){
						return done();
					}
					return done('Did not reuturn error.');
				});
			});
			it('should return error message for null text', function(done){
				currencyBallanceMessage(null, function(err, reply){
					if(err){
						return done();
					}
					return done('Did not reuturn error.');
				});
			});
			it('should return an error is the user does not exist', function(done){
				let userId = getRandomString();
				let startingAmount = 55;
				let db = new data(testUtils.generateDataFilePath());
				let user = new User({name: userId, money: startingAmount});
				let message = 'Please check the ballance of ' + user.name;
				currencyBallanceMessage(null, function(err){
					if(err){
						return done();
					}
					return done('Returned ballance of non existant user');
				}, {text: message});
			});
			it('should return a ballance from the database', function(done){
				let userId = getRandomString();
				let startingAmount = 55;
				let db = new data(testUtils.generateDataFilePath());
				let user = new User({name: userId, money: startingAmount});
				let message = 'Please check the ballance of ' + user.name;
				db.set(user, function(err, doc){
					currencyBallanceMessage(null, function(err, reply){
						if(err){
							return done(err);
						}
						assert.equal(doc.name + ' has a ballance of ' + doc.money, reply);
						return done();
					}, {text: message, db: db, user: doc});
				});
			});
		});
	});
	after(testUtils.deleteTempDataPath);
});