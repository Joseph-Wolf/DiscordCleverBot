"use strict";

const assert = require('assert');
const User = require('../src/db/class/user.js');
const NumberOfTrials = 10;

describe('User', function(){
	describe('Constructor', function(){
		it('should create an object', function(){
			assert.ok(new User());
		});
	});
	describe('Money', function(){
		it('should default money to 0', function(){
			let user = new User();
			assert.equal(0, user.money);
		});
		it('should populate given inputs', function(){
			let startingName = 'kdfskjfks';
			let startingMoney = 55;
			let user = new User({name: startingName, money: startingMoney, dummyToBeIgnored: 'anything i want it to be'});
			assert.equal(startingName, user.name);
			assert.equal(startingMoney, user.money);
		});
		it('should not allow non int money initialization', function(){
			let invalidMonies = [null, undefined, 'string', -1, 1.1];
			let expectedDefaultMoney = 55;
			let index = 0;
			for(index = 0; index < invalidMonies.length; index++){
				let user = new User({money: expectedDefaultMoney});
				assert.equal(expectedDefaultMoney, user.money);
			}
		});
		describe('Add', function(){
			it('should add positive money', function(){
				let user = new User();
				let increment = 5;
				let index = 0;
				for(index = 0; index < NumberOfTrials; index++){
					let initial = user.money;
					user.addMoney(increment);
					assert.equal(initial + increment, user.money);
				}
			});
			it('should not add negative money', function(){
				let user = new User();
				let increment = -5;
				let index = 0;
				user.money = increment * NumberOfTrials;
				for(index = 0; index < NumberOfTrials; index++){
					let initial = user.money;
					user.addMoney(increment);
					assert.equal(initial, user.money);
				}
			});
			it('should do nothing with non integers', function(){
				let user = new User();
				let nonIntegers = [1.2, 'hello', null];
				let index = 0;
				for(index = 0; index < nonIntegers.length; index++){
					let initial = user.money;
					user.addMoney(nonIntegers[index]);
					assert.equal(initial, user.money);
				}
			});
		});
		describe('Subtract', function(){
			it('should do nothing with negative inputs', function(done){
				let user = new User();
				user.money = 10;
				user.subtractMoney(-9, function(err, ballance){
					if(err){
						return done(err);
					}
					assert.equal(10, user.money);
					assert.equal(10, ballance);
					return done();
				});
			});
			it('should subtract if ballance is enough', function(done){
				let user = new User();
				user.money = 10;
				user.subtractMoney(9, function(err, ballance){
					if(err){
						return done(err);
					}
					assert.equal(1, user.money);
					assert.equal(1, ballance);
					return done();
				});
			});
			it('should return an error if ballance is not enough', function(done){
				let user = new User();
				user.money = 10;
				user.subtractMoney(11, function(err, ballance){
					if(err){
						return done();
					}
					return done('subtracted more than user possessed');
				})
			});
			it('should do nothing with non integers', function(done){
				let user = new User();
				user.money = 20;
				user.subtractMoney(1.2, function(err, ballance){
					if(err){
						return done(err);
					}
					assert.ok(20, user.money);
					user.subtractMoney('hello', function(err, ballance){
						if(err){
							return done(err);
						}
						assert.ok(20, user.money);
						user.subtractMoney(null, function(err, ballance){
							if(err){
								return done(err);
							}
							assert.ok(20, user.money);
							return done();
						});
					});
				});
			});
		});
	});
});