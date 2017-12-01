"use strict";

const assert = require('assert');
const randomInt = require('random-int');
const getFact = require('../../src/util/getFact.js');

describe('getFact', function(){
	describe('cats', function(){
		function generateMessage(){
			return 'cat';
		}
		it('should return a random fact', function(done){
			getFact(generateMessage(), done);
		});
	});
	describe('dogs', function(){
		function generateMessage(){
			return 'dog';
		}
		it('should return a random fact', function(done){
			getFact(generateMessage(), done);
		});
	});
	describe('years', function(){
		function generateMessage(number){
			return 'year ' + number;
		}
		it('should return a random fact', function(done){
			getFact(generateMessage(), done);
		});
		it('should return a specific fact', function(done){
			let number = randomInt(100, 2000);
			getFact(generateMessage(number), function(err, response){
				assert.ok(response);
				assert.ok(response.indexOf(number) !== -1);
				done();
			});
		});
	});
	describe('date', function(){
		function generateMessage(month, day){
			return 'date ' + month + ' ' + day;
		}
		it('should return a random fact', function(done){
			getFact(generateMessage(), done);
		});
		it('should return a specific fact', function(done){
			let month = randomInt(1, 12);
			let day = randomInt(1, 32);
			getFact(generateMessage(month, day), done);
		});
		it('should return an random fact for invalid month', function(done){
			let month = randomInt(-99999, 0);
			let day = randomInt(1, 32);
			getFact(generateMessage(month, day), done);
		});
		it('should return an random fact for invalid day', function(done){
			let month = randomInt(1, 12);
			let day = randomInt(50, 9999);
			getFact(generateMessage(month, day), done);
		});
	});
	describe('number', function(){
		function generateMessage(number){
			return 'number ' + number;
		}
		it('should return a random fact', function(done){
			getFact(generateMessage(), done);
		});
		it('should return a specific fact', function(done){
			let number = randomInt(0, 99999);
			getFact(generateMessage(number), function(err, response){
				assert.ok(response);
				assert.ok(response.indexOf(number) !== -1);
				done();
			});
		});
	});
	describe('trivia', function(){
		function generateMessage(number){
			return 'trivia ' + number;
		}
		it('should return a random fact', function(done){
			getFact(generateMessage(), done);
		});
		it('should return a specific fact', function(done){
			let number = randomInt(0, 99999);
			getFact(generateMessage(number), function(err, response){
				assert.ok(response);
				assert.ok(response.indexOf(number) !== -1);
				done();
			});
		});
	});
});