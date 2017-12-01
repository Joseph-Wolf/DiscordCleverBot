"use strict";

const assert = require('assert');
const randomString = require('random-string');
const discordbot = require('../src/discordbot.js');

function MockCollection(initarray){
	let self = this;
	self.testArray = initarray ? initarray : [];
	self.filter = function(callback){
		self.testArray = self.testArray.filter(callback);
		return self;
	};
	self.first = function(){return self.testArray[0]};
	self.array = function(){return self.testArray};
	self.members =  self.testArray;
	self.every = function(callback){return self.testArray.every(callback);};
	self.map = function(callback){return self.testArray.map(callback)};
	return self;
}

function MockMessage(content, author){
	let self = this;
	self.cleanContent = content ? content : '';
	self.author = author ? author : {id: randomString()};
	self.isMentioned = function(){return true;}
	self.mentions = {
		users: new MockCollection(),
		roles: new MockCollection()
	};
	self.member = {
		hasPermission: function(){
			return true;
		}
	}
	return self;
}

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
		beforeEach(function(){
			let testUser = {id: randomString(), bot: true};
			bot.client.user = testUser;
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
			bot.client.emit('message', new MockMessage('hello world'));
		});
		it('should pass an err, callback, and params', function(done){
			let expectedText = 'hello world';
			bot.registerMessage(/hello/, function(err, params, callback){
				if(err){
					return done(err);
				}
				assert.equal(expectedText, params.text);
				assert.ok(callback);
				assert.equal(typeof callback, 'function');
				return done();
			});
			//Emit the message
			bot.client.emit('message', new MockMessage(expectedText));
		});
		it('should pass users single users as array', function(done){
			let expectedText = 'hello world';
			let testMessage = new MockMessage('hello world');
			let testID = randomString();
			let testName = randomString();
			let testUser = {id:testID, toString: function(){return testName;}};
			let expectedUser = {discordId: testID, name: testName};
			testMessage.mentions.users.testArray = [testUser];
			bot.registerMessage(/hello/, function(err, params, callback){
				if(err){
					return done(err);
				}
				assert.ok(params.users);
				assert.ok(typeof params.users, 'array');
				assert.deepEqual(params.users[0], expectedUser);
				return done();
			});
			//Emit the message
			bot.client.emit('message', testMessage);
		});
		it('should pass users multiple users as array', function(done){
			let expectedText = 'hello world';
			let testMessage = new MockMessage(expectedText);
			let numberOfUsers = 5;
			let expectedUsers = [];
			let testUsers = [];
			for(let index = 0; index < numberOfUsers; index++){
				let testID = randomString();
				let testName = randomString();
				testUsers.push({id:testID, toString: function(){return testName;}});
				expectedUsers.push({discordId: testID, name: testName});
			}
			testMessage.mentions.users.testArray = testUsers;
			bot.registerMessage(/hello/, function(err, params, callback){
				if(err){
					return done(err);
				}
				assert.ok(params.users);
				assert.ok(typeof params.users, 'array');
				assert.equal(params.users.length, numberOfUsers);
				assert.deepEqual(params.users, expectedUsers);
				return done();
			});
			//Emit the message
			bot.client.emit('message', testMessage);
		});
		it('should resolve roles to users', function(done){
			let expectedText = 'hello world';
			let testMessage = new MockMessage(expectedText);
			let numberOfUsers = 5;
			let usersInRole1 = [];
			let usersInRole2 = [];
			let expectedUsers = [];
			for(let index = 0; index < numberOfUsers; index++){
				let id1 = randomString();
				let id2 = randomString();
				let name1 = randomString();
				let name2 = randomString();
				usersInRole1.push({id:id1, toString: function(){return name1;}});
				expectedUsers.push({discordId:id1, name: name1});
				usersInRole1.push({id:id2, toString: function(){return name2;}});
				expectedUsers.push({discordId:id2, name: name2});
			}
			testMessage.mentions.roles.testArray = new MockCollection([new MockCollection(usersInRole1), new MockCollection(usersInRole2)]);
			bot.registerMessage(/hello/, function(err, params, callback){
				if(err){
					return done(err);
				}
				assert.ok(params.users);
				assert.ok(typeof params.users, 'array');
				assert.equal(params.users.length, numberOfUsers * 2);
				assert.deepEqual(params.users, expectedUsers);
				return done();
			});
			//Emit the message
			bot.client.emit('message', testMessage);
		});
		it('should remove the bot from the users array', function(done){
			let expectedText = 'hello world';
			let testMessage = new MockMessage(expectedText);
			let numberOfUsers = 5;
			let testAuthor = {id: randomString(), toString: function(){return randomString()}};
			let testBot = {id: randomString(), toString: function(){return randomString()}};
			let expectedUsers = [];
			let testUsers = [];
			for(let index = 0; index < numberOfUsers; index++){
				let testID = randomString();
				let testName = randomString();
				testUsers.push({id:testID, toString: function(){return testName;}});
				expectedUsers.push({discordId: testID, name: testName});
			}
			//Push bot onto list
			testUsers.push(bot.client.user);
			testMessage.mentions.users.testArray = testUsers;
			bot.registerMessage(/hello/, function(err, params, callback){
				if(err){
					return done(err);
				}
				assert.ok(params.users);
				assert.ok(typeof params.users, 'array');
				assert.equal(params.users.length, numberOfUsers);
				assert.deepEqual(params.users, expectedUsers);
				return done();
			});
			//Emit the message
			bot.client.emit('message', testMessage);
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
		it('should not register the welcome messagef if false', function(){
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