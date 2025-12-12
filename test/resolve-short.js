const { test } = require('node:test')
const assert = require('node:assert')
const nopt = require('../lib/nopt-lib.js')

test('basic', () => {
  const assertShort = (v, expected) => {
    const k = 'package-lock'
    assert.deepStrictEqual(nopt.resolveShort(v, {
      shorthands: { shrinkwrap: `--${k} true` },
      types: { [k]: Boolean },
    }), expected !== undefined ? expected : [`--${k}`, 'true'], v)
  }

  assertShort('--shrinkwrap')
  assertShort('--shrinkwra')
  assertShort('-shrinkwra')
  assertShort('shr')
  assertShort('--package-lock', null)
  assertShort('--pa', null)
})
