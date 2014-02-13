var nopt = require("../")
  , test = require('tap').test


test("passing a string results in a string", function (t) {
  var parsed = nopt({ key: String }, {}, ["--key", "myvalue"], 0)
  t.same(parsed.key, "myvalue")
  t.end()
})

// https://github.com/npm/nopt/issues/31
test("Empty String results in empty string, not true", function (t) {
  var parsed = nopt({ empty: String }, {}, ["--empty"], 0)
  t.same(parsed.empty, "")
  t.end()
})
