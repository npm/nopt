const nopt = require('../')
const t = require('tap')
const isWin = process.platform === 'win32'

t.test('empty array is fine if type includes Array', t => {
  const types = {
    arr: [Array, String],
  }
  const data = {
    arr: [],
  }
  nopt.clean(data, types)
  t.same(data.arr, [])
  t.end()
})

t.test('passing a string results in a string', t => {
  const parsed = nopt({ key: String }, {}, ['--key', 'myvalue'], 0)
  t.same(parsed.key, 'myvalue')
  t.end()
})

// https://github.com/npm/nopt/issues/31
t.test('Empty String results in empty string, not true', t => {
  const parsed = nopt({ empty: String }, {}, ['--empty'], 0)
  t.same(parsed.empty, '')
  t.end()
})

// https://github.com/npm/nopt/issues/65
t.test('Empty String should not swallow next flag', t => {
  const parsed = nopt({ empty: String, foo: String }, {}, ['--empty', '--foo'], 0)
  t.same(parsed.empty, '')
  t.same(parsed.foo, '')
  t.end()
})

// https://github.com/npm/nopt/issues/66
t.test('Empty String should not be true when type is single item Array', t => {
  const parsed = nopt({ foo: [String] }, {}, ['--foo'], 0)
  t.same(parsed.foo, '')
  t.end()
})

t.test('~ path is resolved to ' + (isWin ? '%USERPROFILE%' : '$HOME'), t => {
  const path = require('path')
  const the = isWin
    ? {
      key: 'USERPROFILE',
      dir: 'C:\\temp',
      val: '~\\val',
    } : {
      key: 'HOME',
      dir: '/tmp',
      val: '~/val',
    }

  if (!process.env[the.key]) {
    process.env[the.key] = the.dir
  }
  const parsed = nopt({ key: path }, {}, ['--key=' + the.val], 0)
  t.same(parsed.key, path.resolve(process.env[the.key], 'val'))
  t.end()
})

// https://github.com/npm/nopt/issues/24
t.test('Unknown options are not parsed as numbers', t => {
  const parsed = nopt({ 'parse-me': Number }, null, ['--leave-as-is=1.20', '--parse-me=1.20'], 0)
  t.equal(parsed['leave-as-is'], '1.20')
  t.equal(parsed['parse-me'], 1.2)
  t.end()
})

// https://github.com/npm/nopt/issues/48
t.test('Check types based on name of type', t => {
  const parsed = nopt({ 'parse-me': { name: 'Number' } }, null, ['--parse-me=1.20'], 0)
  t.equal(parsed['parse-me'], 1.2)
  t.end()
})

t.test('Missing types are not parsed', t => {
  const parsed = nopt({ 'parse-me': {} }, null, ['--parse-me=1.20'], 0)
  // should only contain argv
  t.equal(Object.keys(parsed).length, 1)
  t.end()
})

t.test('Types passed without a name are not parsed', t => {
  const parsed = nopt({ 'parse-me': {} }, {}, ['--parse-me=1.20'], 0)
  // should only contain argv
  t.equal(Object.keys(parsed).length, 1)
  t.end()
})

t.test('no types does not throw', t => {
  const parsed = nopt(null, null, ['--leave-as-is=1.20'], 0)
  t.equal(parsed['leave-as-is'], '1.20')
  t.end()
})

t.test('clean: no types does not throw', t => {
  const data = { 'leave-unknown': 'still here' }
  nopt.clean(data)
  t.strictSame(data, { 'leave-unknown': 'still here' })
  t.end()
})

t.test('other tests', t => {
  const Stream = require('stream')
  const path = require('path')
  const url = require('url')

  const shorthands =
      { s: ['--loglevel', 'silent'],
        d: ['--loglevel', 'info'],
        dd: ['--loglevel', 'verbose'],
        ddd: ['--loglevel', 'silly'],
        noreg: ['--no-registry'],
        reg: ['--registry'],
        'no-reg': ['--no-registry'],
        silent: ['--loglevel', 'silent'],
        verbose: ['--loglevel', 'verbose'],
        h: ['--usage'],
        H: ['--usage'],
        '?': ['--usage'],
        help: ['--usage'],
        v: ['--version'],
        f: ['--force'],
        desc: ['--description'],
        'no-desc': ['--no-description'],
        local: ['--no-global'],
        l: ['--long'],
        p: ['--parseable'],
        porcelain: ['--parseable'],
        g: ['--global'],
      }

  const types =
      { aoa: Array,
        nullstream: [null, Stream],
        date: Date,
        str: String,
        browser: String,
        cache: path,
        color: ['always', Boolean],
        depth: Number,
        description: Boolean,
        dev: Boolean,
        editor: path,
        force: Boolean,
        global: Boolean,
        globalconfig: path,
        group: [String, Number],
        gzipbin: String,
        logfd: [Number, Stream],
        loglevel: ['silent', 'win', 'error', 'warn', 'info', 'verbose', 'silly'],
        long: Boolean,
        'node-version': [false, String],
        npaturl: url,
        npat: Boolean,
        'onload-script': [false, String],
        outfd: [Number, Stream],
        parseable: Boolean,
        pre: Boolean,
        prefix: path,
        proxy: url,
        'rebuild-bundle': Boolean,
        registry: url,
        searchopts: String,
        searchexclude: [null, String],
        shell: path,
        t: [Array, String],
        tag: String,
        tar: String,
        tmp: path,
        'unsafe-perm': Boolean,
        usage: Boolean,
        user: String,
        username: String,
        userconfig: path,
        version: Boolean,
        viewer: path,
        _exit: Boolean,
        path: path,
      }

  ; [['-v', { version: true }, []],
    ['---v', { version: true }, []],
    ['ls -s --no-reg connect -d',
      { loglevel: 'info', registry: null }, ['ls', 'connect']],
    ['ls ---s foo', { loglevel: 'silent' }, ['ls', 'foo']],
    ['ls --registry blargle', {}, ['ls']],
    ['--no-registry', { registry: null }, []],
    ['--no-color true', { color: false }, []],
    ['--no-color false', { color: true }, []],
    ['--no-color', { color: false }, []],
    ['--color false', { color: false }, []],
    ['--color --logfd 7', { logfd: 7, color: true }, []],
    ['--color=true', { color: true }, []],
    ['--logfd=10', { logfd: 10 }, []],
    ['--tmp=/tmp -tar=gtar', { tmp: isWin ? 'C:\\tmp' : '/tmp', tar: 'gtar' }, []],
    ['--tmp=tmp -tar=gtar',
      { tmp: path.resolve(process.cwd(), 'tmp'), tar: 'gtar' }, []],
    ['--logfd x', {}, []],
    ['a -true -- -no-false', { true: true }, ['a', '-no-false']],
    ['a -no-false', { false: false }, ['a']],
    ['a -no-no-true', { true: true }, ['a']],
    ['a -no-no-no-false', { false: false }, ['a']],
    ['---NO-no-No-no-no-no-nO-no-no' +
      '-No-no-no-no-no-no-no-no-no' +
      '-no-no-no-no-NO-NO-no-no-no-no-no-no' +
      '-no-body-can-do-the-boogaloo-like-I-do',
    { 'body-can-do-the-boogaloo-like-I-do': false }, []],
    ['we are -no-strangers-to-love ' +
      '--you-know=the-rules --and=so-do-i ' +
      '---im-thinking-of=a-full-commitment ' +
      '--no-you-would-get-this-from-any-other-guy ' +
      '--no-gonna-give-you-up ' +
      '-no-gonna-let-you-down=true ' +
      '--no-no-gonna-run-around false ' +
      '--desert-you=false ' +
      '--make-you-cry false ' +
      '--no-tell-a-lie ' +
      '--no-no-and-hurt-you false',
    { 'strangers-to-love': false,
      'you-know': 'the-rules',
      and: 'so-do-i',
      'you-would-get-this-from-any-other-guy': false,
      'gonna-give-you-up': false,
      'gonna-let-you-down': false,
      'gonna-run-around': false,
      'desert-you': false,
      'make-you-cry': false,
      'tell-a-lie': false,
      'and-hurt-you': false,
    }, ['we', 'are']],
    ['-t one -t two -t three',
      { t: ['one', 'two', 'three'] },
      []],
    ['-t one -t null -t three four five null',
      { t: ['one', 'null', 'three'] },
      ['four', 'five', 'null']],
    ['-t foo',
      { t: ['foo'] },
      []],
    ['--no-t',
      { t: ['false'] },
      []],
    ['-no-no-t',
      { t: ['true'] },
      []],
    ['-aoa one -aoa null -aoa 100',
      { aoa: ['one', null, '100'] },
      []],
    ['-str 100',
      { str: '100' },
      []],
    ['--color always',
      { color: 'always' },
      []],
    ['--no-nullstream',
      { nullstream: null },
      []],
    ['--nullstream false',
      { nullstream: null },
      []],
    ['--notadate=2011-01-25',
      { notadate: '2011-01-25' },
      []],
    ['--date 2011-01-25',
      { date: new Date('2011-01-25') },
      []],
    ['--date xxxxxxxxxx', // invalid date -> NaN
      {},
      []],
    ['--registry https://github.com',
      { registry: 'https://github.com/' },
      []],
    ['-cl 1',
      { config: true, length: 1 },
      [],
      { config: Boolean, length: Number, clear: Boolean },
      { c: '--config', l: '--length' }],
    ['--acount bla',
      { acount: true },
      ['bla'],
      { account: Boolean, credentials: Boolean, options: String },
      { a: '--account', c: '--credentials', o: '--options' }],
    ['--clear',
      { clear: true },
      [],
      { clear: Boolean, con: Boolean, len: Boolean, exp: Boolean, add: Boolean, rep: Boolean },
      { c: '--con', l: '--len', e: '--exp', a: '--add', r: '--rep' }],
    ['--file -',
      { file: '-' },
      [],
      { file: String },
      {}],
    ['--file -',
      { file: true },
      ['-'],
      { file: Boolean },
      {}],
    ['--path',
      { path: null },
      []],
    ['--path .',
      { path: process.cwd() },
      []],
  ].forEach(function (params) {
    const argv = params[0].split(/\s+/)
    const opts = params[1]
    const rem = params[2]
    const actual = nopt(params[3] || types, params[4] || shorthands, argv, 0)
    const parsed = actual.argv
    delete actual.argv
    for (const i in opts) {
      const e = JSON.stringify(opts[i])
      const a = JSON.stringify(actual[i] === undefined ? null : actual[i])
      if (e && typeof e === 'object') {
        t.same(e, a)
      } else {
        t.equal(e, a)
      }
    }
    t.same(rem, parsed.remain)
  })
  t.end()
})

t.test('argv toString()', t => {
  const parsed = nopt({ key: String }, {}, ['--key', 'myvalue'], 0)
  t.same(parsed.argv.toString(), '"--key" "myvalue"')
  t.end()
})

t.test('custom invalidHandler', t => {
  t.teardown(() => {
    delete nopt.invalidHandler
  })
  nopt.invalidHandler = (k, v) => {
    t.match(k, 'key')
    t.match(v, 'nope')
    t.end()
  }
  nopt({ key: Number }, {}, ['--key', 'nope'], 0)
})

t.test('numbered boolean', t => {
  const parsed = nopt({ key: [Boolean, String] }, {}, ['--key', '0'], 0)
  t.same(parsed.key, false)
  t.end()
})

t.test('false string boolean', t => {
  const parsed = nopt({ key: [Boolean, String] }, {}, ['--key', 'false'], 0)
  t.same(parsed.key, false)
  t.end()
})

t.test('true string boolean', t => {
  const parsed = nopt({ key: [Boolean, String] }, {}, ['--key', 'true'], 0)
  t.same(parsed.key, true)
  t.end()
})

t.test('null string boolean', t => {
  const parsed = nopt({ key: [Boolean, String] }, {}, ['--key', 'null'], 0)
  t.same(parsed.key, false)
  t.end()
})

t.test('other string boolean', t => {
  const parsed = nopt({ key: [Boolean, String] }, {}, ['--key', 'yes'], 0)
  t.same(parsed.key, true)
  t.end()
})

t.test('number boolean', t => {
  const parsed = nopt({ key: [Boolean, Number] }, {}, ['--key', '100'], 0)
  t.same(parsed.key, true)
  t.end()
})

t.test('no args', (t) => {
  const _argv = process.argv
  t.teardown(() => process.argv = _argv)
  process.argv = ['', '', 'a']
  t.strictSame(nopt(), { argv: { remain: ['a'], cooked: ['a'], original: ['a'] } })
  t.end()
})
