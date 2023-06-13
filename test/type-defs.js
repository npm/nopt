const t = require('tap')
const path = require('path')
const os = require('os')

const nopt = (t, argv, opts, expected) => {
  const mockNopt = t.mock('../lib/nopt-lib.js', {
    '../lib/type-defs.js': t.mock('../lib/type-defs.js'),
  })
  t.match(
    mockNopt.nopt(argv, { typeDefs: mockNopt.typeDefs, ...opts }),
    expected
  )
  t.end()
}

t.test('path + null', t => {
  nopt(t, ['--x', 'null'], { types: { x: [path, null] } }, {
    x: undefined,
  })
})

t.test('win32 path', t => {
  const platform = Object.getOwnPropertyDescriptor(process, 'platform')
  t.teardown(() => Object.defineProperty(process, 'platform', platform))
  Object.defineProperty(process, 'platform', { ...platform, value: 'win32' })
  nopt(t, ['--x', '~/y'], { types: { x: path } }, {
    x: `${os.homedir()}/y`,
  })
})
