const t = require('tap')
const noptLib = require('../lib/nopt-lib.js')
const Stream = require('stream')

const nopt = (t, argv, opts, expected) => {
  if (Array.isArray(argv)) {
    t.strictSame(noptLib.nopt(argv, { typeDefs: noptLib.typeDefs, ...opts }), expected)
  } else {
    noptLib.clean(argv, { typeDefs: noptLib.typeDefs, ...opts })
    t.match(argv, expected)
  }
  t.end()
}

t.test('stream', t => {
  nopt(t, { x: new Stream.Readable() }, { types: { x: Stream } }, {})
})

t.test('no/missing options', t => {
  t.doesNotThrow(() => noptLib.nopt([]))
  t.doesNotThrow(() => noptLib.nopt([], {}))
  t.doesNotThrow(() => noptLib.clean({}))
  t.doesNotThrow(() => noptLib.clean({}, {}))
  t.doesNotThrow(() => noptLib.parse([]))
  t.doesNotThrow(() => noptLib.parse([], {}, [], {}))
  t.doesNotThrow(() => noptLib.validate({}))
  t.doesNotThrow(() => noptLib.validate({}, null, null, null, {}))
  t.doesNotThrow(() => noptLib.resolveShort(''))
  t.doesNotThrow(() => noptLib.resolveShort('', {}))
  t.doesNotThrow(() => noptLib.resolveShort('', {}, {}, {}))
  t.end()
})

t.test('key argv is ignored', (t) => {
  nopt(t, ['--argvv', '--argv'], {}, {
    argvv: true,
    argv: {
      remain: [],
      cooked: ['--argvv', '--argv'],
      original: ['--argvv', '--argv'],
    },
  })
})

t.test('boolean with null', (t) => {
  nopt(t, ['--boolNull', 'null', '--boolOnly', 'null'], {
    types: {
      boolNull: [Boolean, null],
      boolOnly: [Boolean],
    },
  }, {
    boolNull: false,
    boolOnly: true,
    argv: {
      remain: ['null'],
      cooked: ['--boolNull', 'null', '--boolOnly', 'null'],
      original: ['--boolNull', 'null', '--boolOnly', 'null'],
    },
  })
})

t.test('-- after non string type', (t) => {
  nopt(t, ['--x', '5', '--y', '--', '200'], {
    types: {
      x: Number,
      y: Number,
    },
  }, {
    x: 5,
    // XXX: getting coverage to 100 and this seems wrong
    // test matches current implementation for now
    y: 1,
    argv: {
      remain: ['200'],
      cooked: ['--x', '5', '--y', '--', '200'],
      original: ['--x', '5', '--y', '--', '200'],
    },
  })
})

t.test('nan', (t) => {
  nopt(t, ['--x', '5'], {
    types: {
      x: NaN,
    },
  }, {
    x: undefined,
    argv: {
      remain: [],
      cooked: ['--x', '5'],
      original: ['--x', '5'],
    },
  })
})

t.test('string/null', (t) => {
  nopt(t, ['--x', 'null', '--y', 'false', '--z', 'true'], {
    types: {
      x: Number,
      y: Number,
      z: Number,
    },
  }, {
    argv: {
      remain: [],
      cooked: ['--x', 'null', '--y', 'false', '--z', 'true'],
      original: ['--x', 'null', '--y', 'false', '--z', 'true'],
    },
  })
})

t.test('false invalid handler', (t) => {
  // this is only for coverage
  nopt(t, ['--x', 'null'], {
    types: {
      x: Number,
    },
    invalidHandler: false,
  }, {
    argv: {
      remain: [],
      cooked: ['--x', 'null'],
      original: ['--x', 'null'],
    },
  })
})

t.test('false unknown handler string', (t) => {
  // this is only for coverage
  nopt(t, ['--x', 'null'], {
    unknownHandler: false,
  }, {
    x: true,
    argv: {
      remain: ['null'],
      cooked: ['--x', 'null'],
      original: ['--x', 'null'],
    },
  })
})

t.test('default unknown handler opt', (t) => {
  // this is only for coverage
  nopt(t, ['--x', '--y'], {}, {
    x: true,
    y: true,
    argv: {
      remain: [],
      cooked: ['--x', '--y'],
      original: ['--x', '--y'],
    },
  })
})

t.test('false abbrev handler normal', (t) => {
  // this is only for coverage
  nopt(t, ['--long', 'true'], {
    types: {
      longhand: Boolean,
    },
    abbrevHandler: false,
  }, {
    longhand: true,
    argv: {
      remain: [],
      cooked: ['--long', 'true'],
      original: ['--long', 'true'],
    },
  })
})

t.test('false abbrev handler shorthand', (t) => {
  // this is only for coverage
  nopt(t, ['--shor', 'true'], {
    types: {},
    shorthands: {
      short: '--longhand',
    },
    abbrevHandler: false,
  }, {
    longhand: true,
    argv: {
      remain: [],
      cooked: ['--longhand', 'true'],
      original: ['--shor', 'true'],
    },
  })
})

t.test('normal abbreviation', (t) => {
  nopt(t, ['--shor', 'text'], {
    types: {
      shorthand: String,
    },
  }, {
    shorthand: 'text',
    argv: {
      remain: [],
      cooked: ['--shor', 'text'],
      original: ['--shor', 'text'],
    },
  })
})

t.test('shorthand abbreviation', (t) => {
  nopt(t, ['--shor'], {
    types: {},
    shorthands: {
      short: '--longhand',
    },
  }, {
    longhand: true,
    argv: {
      remain: [],
      cooked: ['--longhand'],
      original: ['--shor'],
    },
  })
})

t.test('shorthands that is the same', (t) => {
  nopt(t, ['--sh'], {
    types: {},
    shorthands: {
      sh: '--sh',
    },
  }, {
    sh: true,
    argv: {
      remain: [],
      cooked: ['--sh'],
      original: ['--sh'],
    },
  })
})

t.test('unknown multiple', (t) => {
  nopt(t, ['--mult', '--mult', '--mult', 'extra'], {
    types: {},
  }, {
    mult: [true, true, true],
    argv: {
      remain: ['extra'],
      cooked: ['--mult', '--mult', '--mult', 'extra'],
      original: ['--mult', '--mult', '--mult', 'extra'],
    },
  })
})
