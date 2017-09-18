"use strict";

module.exports = class Setting{
	constructor(setting) {
		let self = this;
		self._id;
		self.key;
		self.value;
		if(setting === null || setting == undefined){
			return;
		}
		self._id = setting._id;
		self.key = setting.key;
		self.value = setting.value;
	}
};