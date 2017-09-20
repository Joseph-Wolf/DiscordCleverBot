"use strict";

const assert = require('assert');
const cleverbot = require('../src/cleverbot.js');

describe('cleverbot', function(){
	describe('constructor', function(){
		it('should exist', function(){
			let bot = new cleverbot();
			assert.ok(bot);
		});
	});
});