"use strict";

class Setting {
	constructor(name, value) {
		this.name = name;
		this.value = value;
	}
};

const Datastore = require("nedb");
const defaultSettings = [
	new Setting("name", "value"),
	new Setting("name1","value2")
];

var db = {}
db.settings = new Datastore({filename: "data/settings"});
db.settings.loadDatabase();

//Check if there is a document with an id specified
db.settings.findOne({_id: {$exists: true}}, function(err, doc) {
	//If there is no record with id specified it returns a null doc which means it is new
	if(doc === null){
		//If it is new then initialize it with default settings
		db.settings.insert(defaultSettings, function(err, newDoc) {
			console.log("Initialize Settings");
		});
	}
});

function truncateSettings() {
	db.settings.remove({_id: {$exists: true}}, function(err, count){
		console.log("Truncate removed " + count + " records");
	});
};

module.exports = {
	truncateSettings: truncateSettings
};