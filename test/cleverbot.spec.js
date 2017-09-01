"use strict";

const assert = require('assert');
const Cleverbot = require('../src/cleverbot.js');

describe('cleverbot', function(){
	describe('constructor', function(){
		it('should return an object', function(){
			assert.ok(Cleverbot);
		});
	});
});