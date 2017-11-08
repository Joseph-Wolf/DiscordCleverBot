"use strict";

const assert = require('assert');
const discordbot = require('../src/discordbot.js');
const getRandomString = require('../src/util/getRandomString.js');

describe('discordbot', function(){
	let bot;
	beforeEach(function(){
		bot = new discordbot();
	});
	describe('constructor', function(){
		it('should exist', function(){
			assert.ok(bot);
		});
		it('should create a client', function(){
			assert.ok(bot.client);
		});
	});
	describe('registerMessage', function(){
		let mockMessage;
		beforeEach(function(){
			let testAuthor = {id: getRandomString()};
			let testUser = {id: getRandomString(), bot: true};

			bot.client.user = testUser;
			mockMessage = {
				cleanContent: 'hello world',
				author: testAuthor,
				isMentioned: function(){return true;},
				mentions: {
					users: {
						arrayOfUsers: [{id:getRandomString()}, testUser, testAuthor],
						filter: function(callback){
							this.arrayOfUsers = this.arrayOfUsers.filter(callback);
							return this;
						},
						first: function(){return this.arrayOfUsers[0]},
						array: function(){return this.arrayOfUsers},
						every: function(callback){return this.arrayOfUsers.every(callback);}
					}
				},
				member: {
					hasPermission: function(){
						return true;
					}
				}
			};
		});
		it('should add messages', function(){
			let initialLength = bot.registeredMessages.length;
			bot.registerMessage(/expression/, null);
			let secondaryLength = bot.registeredMessages.length;
			assert.equal(initialLength + 1, secondaryLength);
		});
		it('should execute callback on expression match', function(done){
			bot.registerMessage(/blah/, function(){
				done('called wrong message');
			});
			bot.registerMessage(/hello/, done);
			bot.registerMessage(/yo/, function(){
				done('called wrong message');
			});
			bot.registerMessage('/./', function(){
				done('called second matching message');
			});
			//Emit the message
			bot.client.emit('message', mockMessage);
		});
		it('should pass an err, callback, and params', function(done){
			let expectedText = 'hello world';
			bot.registerMessage(/hello/, function(err, callback, params){
				assert.equal(expectedText, params.text);
				assert.ok(callback);
				assert.equal(typeof callback, 'function');
				return done();
			});
			//Emit the message
			bot.client.emit('message', mockMessage);
		});
		it('should pass users single users as array', function(done){
			let expectedText = 'hello world';
			let testMessage = mockMessage;
			let testID = getRandomString();
			let testName = getRandomString();
			let testUser = {id:testID, toString: function(){return testName;}};
			let expectedUser = {discordId: testID, name: testName};
			testMessage.mentions.users.arrayOfUsers = [testUser];
			bot.registerMessage(/hello/, function(err, callback, params){
				assert.ok(params.users);
				assert.ok(typeof params.users, 'array');
				assert.deepEqual(params.users[0], expectedUser);
				return done();
			});
			//Emit the message
			bot.client.emit('message', mockMessage);
		});
		it('should pass users multiple users as array', function(done){
			let expectedText = 'hello world';
			let testMessage = mockMessage;
			let numberOfUsers = 5;
			let expectedUsers = [];
			let testUsers = [];
			for(let index = 0; index < numberOfUsers; index++){
				let testID = getRandomString();
				let testName = getRandomString();
				testUsers.push({id:testID, toString: function(){return testName;}});
				expectedUsers.push({discordId: testID, name: testName});
			}
			testMessage.mentions.users.arrayOfUsers = testUsers;
			bot.registerMessage(/hello/, function(err, callback, params){
				assert.ok(params.users);
				assert.ok(typeof params.users, 'array');
				assert.equal(params.users.length, numberOfUsers);
				assert.deepEqual(params.users, expectedUsers);
				return done();
			});
			//Emit the message
			bot.client.emit('message', mockMessage);
		});
		it('should remove the bot from the array', function(done){
			let expectedText = 'hello world';
			let testMessage = mockMessage;
			let numberOfUsers = 5;
			let testAuthor = {id: getRandomString(), toString: function(){return getRandomString()}};
			let testBot = {id: getRandomString(), toString: function(){return getRandomString()}};
			let expectedUsers = [];
			let testUsers = [];
			for(let index = 0; index < numberOfUsers; index++){
				let testID = getRandomString();
				let testName = getRandomString();
				testUsers.push({id:testID, toString: function(){return testName;}});
				expectedUsers.push({discordId: testID, name: testName});
			}
			//Push bot onto list
			testUsers.push(bot.client.user);
			testMessage.mentions.users.arrayOfUsers = testUsers;
			bot.registerMessage(/hello/, function(err, callback, params){
				assert.ok(params.users);
				assert.ok(typeof params.users, 'array');
				assert.equal(params.users.length, numberOfUsers);
				assert.deepEqual(params.users, expectedUsers);
				return done();
			});
			//Emit the message
			bot.client.emit('message', mockMessage);
		});
	});
	describe('welcomeUsers', function(){
		beforeEach(function(){
			bot.getEventCount = function getEventCount(){
				return bot.client._eventsCount;
			};
		});
		it('should register the welcome message if true', function(){
			let initialLength = bot.getEventCount();
			bot.welcomeUsers(true);
			let secondaryLength = bot.getEventCount();
			assert.equal(initialLength + 1, secondaryLength);
		});
		it('should not register the welcome message if false', function(){
			let initialLength = bot.getEventCount();
			bot.welcomeUsers(false);
			let secondaryLength = bot.getEventCount();
			assert.equal(initialLength, secondaryLength);
		});
	});
	//TODO: fix
	describe('authenticate', function(){
		it.skip('should fail to authenticate garbage key', function(done){
			let key = 'garbage';
			bot.authenticate(key, function(err, accepted){
				if(err){
					return done();
				}
				return done('Invalid Discord key did not fail');
			});
		});
		it.skip('should authenticate valid key', function(done){
			//TODO: find a way to insert a valid key without saving it in source control.
			let key = 'validKey';
			bot.authenticate(key, done);
		});
	});
});