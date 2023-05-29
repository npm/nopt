const t = require('tap')
const nopt = require('../lib/nopt-lib.js')

t.test('use other type default', (t) => {
  const NotAllowed = Symbol('NotAllowed')
  const Invalid = Symbol('Invalid')

  const clean = (data, opts) => {
    const invalids = []
    nopt.clean(data, {
      types: {
        str: nopt.typeDefs.String.type,
        invalid: Invalid,
      },
      typeDefs: {
        ...nopt.typeDefs,
        NotAllowed: { type: NotAllowed, validate: () => false },
        Invalid: { type: Invalid, validate: () => false },
      },
      invalidHandler: (k, v, type) => invalids.push([k, v, type]),
      ...opts,
    })
    return {
      keys: Object.keys(data),
      invalids,
    }
  }

  t.strictSame(clean({
    str: 'aaa',
    invalid: 'bad',
    unknown: 'huh?',
  }), {
    keys: ['str', 'unknown'],
    invalids: [['invalid', 'bad', Invalid]],
  }, 'invalid data is removed with clean')

  t.strictSame(clean({
    str: 'aaa',
    invalid: 'bad',
    unknown: 'huh?',
  }, { typeDefault: NotAllowed }), {
    keys: ['str'],
    invalids: [['invalid', 'bad', Invalid], ['unknown', 'huh?', NotAllowed]],
  }, 'invalid and unknown data is removed with a custom typeDefault')

  t.end()
})
