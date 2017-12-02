"use strict";

const assert = require('assert');
const randomString = require('random-string');
const Discord = require('discord.js');
const registerMessages = require('../../src/init/registerMessages.js');
const listenerName = 'message';

let validMessage = 'hello world';
let validExpression = /hello/i;

function objectIsFunction(obj){
	return typeof obj === 'function';
}

function objectIsArray(obj){
	return Array.isArray(obj);
}

function MockCollection(initarray){
	let self = this;
	self.testArray = (initarray || []);
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
	self.cleanContent = (content || '');
	self.author = (author || {id: randomString()});
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

describe('registerMessages', function(){
	let client = null;
	beforeEach(function(){
		client = new Discord.Client();
	});
	it('should add messages', function(){
		assert.equal(client.listenerCount(listenerName), 0);
		registerMessages(client, [{}]);
		assert.equal(client.listenerCount(listenerName), 1);
	});
	it('should replace existing messages', function(){
		assert.equal(client.listenerCount(listenerName), 0);
		registerMessages(client, [{}]);
		assert.equal(client.listenerCount(listenerName), 1);
		registerMessages(client, [{}]);
		assert.equal(client.listenerCount(listenerName), 1);
	});
	it('should execute callback on expression match', function(done){
		let mess1 = {expression: /yo/i, callback: function(){return done('Executed message 1')}};
		let mess2 = {expression: validExpression, callback: done};
		let mess3 = {expression: /./i, callback: function(){return done('Executed message 3')}};
		registerMessages(client, [mess1, mess2, mess3]);
		client.emit(listenerName, new MockMessage(validMessage, randomString())); //Emit the message
	});
	it('should pass an err, params, and callback', function(done){
		let testString = randomString()
		registerMessages(client, [{expression: validExpression, additionalParams: {test: testString}, callback: function(err, params, callback){
			assert.equal(validMessage, params.text);
			assert.equal(testString, params.test);
			assert.ok(callback);
			assert.ok(objectIsFunction(callback));
			return done();
		}}]);
		client.emit(listenerName, new MockMessage(validMessage, randomString())); //Emit the message
	});
	it('should pass users single users as array', function(done){
		let testMessage = new MockMessage(validMessage);
		let testID = randomString();
		let testName = randomString();
		let testUser = {id:testID, toString: function(){return testName;}};
		let expectedUser = {discordId: testID, name: testName};
		testMessage.mentions.users.testArray = [testUser];
		registerMessages(client, [{expression: validExpression, callback: function(err, params, callback){
			if(err){
				return done(err);
			}
			assert.ok(params.users);
			assert.ok(objectIsArray(params.users));
			assert.deepEqual(params.users[0], expectedUser);
			return done();
		}}]);
		client.emit(listenerName, testMessage); //Emit the message
	});
	it('should pass users multiple users as array', function(done){
		let testMessage = new MockMessage(validMessage);
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
		registerMessages(client, [{expression: validExpression, callback: function(err, params, callback){
			if(err){
				return done(err);
			}
			assert.ok(params.users);
			assert.ok(objectIsArray(params.users));
			assert.equal(params.users.length, numberOfUsers);
			assert.deepEqual(params.users, expectedUsers);
			return done();
		}}]);
		client.emit(listenerName, testMessage); //Emit the message
	});
	it('should resolve roles to users', function(done){
		let testMessage = new MockMessage(validMessage);
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
		registerMessages(client, [{expression: validExpression, callback: function(err, params, callback){
			if(err){
				return done(err);
			}
			assert.ok(params.users);
			assert.ok(objectIsArray(params.users));
			assert.equal(params.users.length, numberOfUsers * 2);
			assert.deepEqual(params.users, expectedUsers);
			return done();
		}}]);
		client.emit(listenerName, testMessage); //Emit the message
	});
	it('should remove any bots and the author from the users array', function(done){
		let testMessage = new MockMessage(validMessage);
		let numberOfUsers = 5;
		let testAuthor = {id: randomString(), toString: function(){return randomString()}};
		let testBot = {id: randomString(), toString: function(){return randomString()}, bot: true};
		let expectedUsers = [];
		let testUsers = [];
		for(let index = 0; index < numberOfUsers; index++){
			let testID = randomString();
			let testName = randomString();
			testUsers.push({id:testID, toString: function(){return testName;}});
			expectedUsers.push({discordId: testID, name: testName});
		}
		//Push bot onto list
		testUsers.push(testBot);
		testMessage.mentions.users.testArray = testUsers;
		registerMessages(client, [{expression: validExpression, callback: function(err, params, callback){
			if(err){
				return done(err);
			}
			assert.ok(params.users);
			assert.ok(objectIsArray(params.users));
			assert.equal(params.users.length, numberOfUsers);
			assert.deepEqual(params.users, expectedUsers);
			return done();
		}}]);
		client.emit(listenerName, testMessage); //Emit the message
	});
});