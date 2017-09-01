"use strict";

const assert = require('assert');
const getRandomString = require('../src/util/getRandomString.js');

describe('GetRandomString', function(){
	it('should return a string', function(){
		var newString = getRandomString();
		assert.ok(typeof newString === 'string');
	});
	it('should return a unique string each time', function(){
		var stringArray = [];
		for(var i = 0; i < 10; i++){
			var newString = getRandomString();
			if(stringArray.indexOf(newString) !== -1){
				assert.fail(newString, stringArray);
			}
			stringArray.push(newString);
		}
		assert.ok(true);
	});
})