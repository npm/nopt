const t = require('tap')
const nopt = require('../lib/nopt-lib.js')

t.test('fallback types', (t) => {
  const n = (dynamicTypes) => {
    const args = [
      '--hello', '100',
      '--goodbye', '50',
      '--hat=blue',
      '--mult', '200',
      '--mult', '300',
      '--multeq=111',
      '--multeq=999',
    ]
    const res = nopt.nopt(args, {
      types: { hello: nopt.typeDefs.Number.type },
      dynamicTypes,
      typeDefs: nopt.typeDefs,
      shorthands: {},
    })
    delete res.argv.cooked
    delete res.argv.original
    return res
  }

  t.strictSame(n(), {
    hello: 100,
    goodbye: true,
    hat: 'blue',
    mult: [
      true,
      true,
    ],
    multeq: [
      '111',
      '999',
    ],
    argv: {
      remain: [
        '50',
        '200',
        '300',
      ],
    },
  }, 'parse args with no fallback')

  t.strictSame(n((k) => {
    if (k.startsWith('goo')) {
      return nopt.typeDefs.Number.type
    }
    if (k === 'mult') {
      return [nopt.typeDefs.Number.type, nopt.typeDefs.Array.type]
    }
  }), {
    hello: 100,
    goodbye: 50,
    hat: 'blue',
    mult: [
      200,
      300,
    ],
    multeq: [
      '111',
      '999',
    ],
    argv: {
      remain: [],
    },
  }, 'parse args with no fallback')

  t.end()
})
