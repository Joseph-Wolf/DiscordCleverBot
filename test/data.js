const data = require("util/api/data.js");

QUnit.module("data");
test("exists", function (assert) {
    assert.notOk(data.truncateSettings, "data is ok");
});
