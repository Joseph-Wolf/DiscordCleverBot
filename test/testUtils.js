"use strict";

const fs = require('fs');
const rimraf = require('rimraf');
const path = require('path');
const getRandomString = require('../src/util/getRandomString.js');
const tmpDataPath = path.join('test','data');

module.exports = {
	generateDataFilePath: function (){
		return path.join(tmpDataPath, getRandomString());
	},
	deleteTempDataPath: function(){
		if (fs.existsSync(tmpDataPath)){
			rimraf.sync(tmpDataPath);
		}
	}
};