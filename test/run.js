const qunit = require("qunit");

qunit.run([
    {
        code: "util/api/data.js",
        tests: "test/data.js"
    }
]);