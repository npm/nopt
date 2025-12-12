const { test } = require('node:test')
const assert = require('node:assert')
const path = require('path')
const os = require('os')
const noptLib = require('../lib/nopt-lib.js')

const nopt = (t, argv, opts, expected) => {
  const result = noptLib.nopt(argv, { typeDefs: noptLib.typeDefs, ...opts })
  // Partial object matching - check only expected properties
  for (const key in expected) {
    assert.deepStrictEqual(result[key], expected[key])
  }
}

test('path + null', t => {
  nopt(t, ['--x', 'null'], { types: { x: [path, null] } }, {
    x: undefined,
  })
})

test('win32 path', t => {
  const platform = Object.getOwnPropertyDescriptor(process, 'platform')
  t.after(() => Object.defineProperty(process, 'platform', platform))
  Object.defineProperty(process, 'platform', { ...platform, value: 'win32' })
  nopt(t, ['--x', '~/y'], { types: { x: path } }, {
    x: `${os.homedir()}/y`,
  })
})
