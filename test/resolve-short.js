const t = require('tap')
const nopt = require('../lib/nopt-lib.js')

t.test('basic', (t) => {
  const assertShort = (v, expected) => {
    const k = 'package-lock'
    t.strictSame(nopt.resolveShort(v, {
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

  t.end()
})
