"use strict";

const CleverbotSettingKey = 'CleverbotToken';

module.exports = function (db, cleverbot){
	db.get({key: CleverbotSettingKey}, function(err, doc){
		if(err || doc === null || doc === undefined || doc.value === null || doc.value === undefined || doc.value.user === null || doc.value.user === undefined || doc.value.key === null || doc.value.key === undefined) {
			return;
		}
		return cleverbot.authenticate(doc.value, function(err, accepted){
			if(err){
				return console.log('rejected cleverbot credentials');
			}
			return console.log('accepted cleverbot credentials');
		});
	});
}