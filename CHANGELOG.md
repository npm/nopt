# Changelog

## [7.2.1](https://github.com/npm/nopt/compare/v7.2.0...v7.2.1) (2024-04-21)

### Chores

* [`c861607`](https://github.com/npm/nopt/commit/c861607145e85f6661a7615004b5cdc390061c77) [#159](https://github.com/npm/nopt/pull/159) postinstall for dependabot template-oss PR (@lukekarrys)
* [`28cb4e1`](https://github.com/npm/nopt/commit/28cb4e19f4c80fcd440c64e81fde8ba872a9a976) [#159](https://github.com/npm/nopt/pull/159) bump @npmcli/template-oss from 4.21.3 to 4.21.4 (@dependabot[bot])

## [7.2.0](https://github.com/npm/nopt/compare/v7.1.0...v7.2.0) (2023-06-15)

### Features

* [`008c672`](https://github.com/npm/nopt/commit/008c672daccf9e6fadcb349b95221c9e166d6a9e) [#125](https://github.com/npm/nopt/pull/125) add fallback option to use function when looking up types (@lukekarrys)
* [`082bad3`](https://github.com/npm/nopt/commit/082bad3511cb41a382fd596584fb178b5694e851) [#124](https://github.com/npm/nopt/pull/124) allow setting `typeDefault` on `nopt` and `clean` lib methods (@lukekarrys)

### Bug Fixes

* [`a28412f`](https://github.com/npm/nopt/commit/a28412fd5299a1adcd1fbfd549ee4aa2f51c504d) [#127](https://github.com/npm/nopt/pull/127) cleanup bin (#127) (@lukekarrys)
* [`7f5b507`](https://github.com/npm/nopt/commit/7f5b50795ba3b658223a8a15489369578393e594) [#126](https://github.com/npm/nopt/pull/126) 100 test coverage (#126) (@lukekarrys)

## [7.1.0](https://github.com/npm/nopt/compare/v7.0.0...v7.1.0) (2023-03-08)

### Features

* [`6830137`](https://github.com/npm/nopt/commit/68301373544fe6a5802360eedd114cacfc3340f7) [#116](https://github.com/npm/nopt/pull/116) add lib export to use nopt in non-global mode (#116) (@lukekarrys)

### Bug Fixes

* [`ce918b9`](https://github.com/npm/nopt/commit/ce918b99911acb85060ef25e600db1bc1c626c2e) [#114](https://github.com/npm/nopt/pull/114) remove dead code (@wraithgar)

## [7.0.0](https://github.com/npm/nopt/compare/v6.0.0...v7.0.0) (2022-11-02)

### ⚠️ BREAKING CHANGES

* `nopt` is now compatible with the following semver range for node: `^14.17.0 || ^16.13.0 || >=18.0.0`

### Features

* [`f905544`](https://github.com/npm/nopt/commit/f9055443d05cf155de44d9cae1fb2d65b3adba10) [#101](https://github.com/npm/nopt/pull/101) postinstall for dependabot template-oss PR (@lukekarrys)

### Dependencies

* [`040677d`](https://github.com/npm/nopt/commit/040677de5492fef5d2c91a180e1e73093d40b951) [#111](https://github.com/npm/nopt/pull/111) bump abbrev from 1.1.1 to 2.0.0 (#111)

## [6.0.0](https://github.com/npm/nopt/compare/v5.0.0...v6.0.0) (2022-07-20)


### ⚠ BREAKING CHANGES

* This drops support for node 6 through 10 and non-LTS versions of node12 and node14

### Bug Fixes

* linting ([0cb6aa8](https://github.com/npm/nopt/commit/0cb6aa835eb07279cb063a68a5a1ec999745cb5b))
* replace deprecated String.prototype.substr() ([#85](https://github.com/npm/nopt/issues/85)) ([40c686f](https://github.com/npm/nopt/commit/40c686faffc600ed6f53c5ef1c3c6e1eaeda7c77))


* @npmcli/template-oss@3.5.0 ([56e6c7e](https://github.com/npm/nopt/commit/56e6c7e158737b590ea97fc1aa1d6837451a389d))


### Dependencies

* fix abbrev requirement to use proper spec ([b8c751a](https://github.com/npm/nopt/commit/b8c751a0763b2f622291040fe92ad9547b22a8a9))

### v4.0.1 (2016-12-14)

#### WHOOPS

* [`fb9b1ce`](https://github.com/npm/nopt/commit/fb9b1ce57b3c69b4f7819015be87719204f77ef6)
  Merged so many patches at once that the code fencing
  ([@adius](https://github.com/adius)) added got broken. Sorry,
  ([@adius](https://github.com/adius))!
  ([@othiym23](https://github.com/othiym23))

### v4.0.0 (2016-12-13)

#### BREAKING CHANGES

* [`651d447`](https://github.com/npm/nopt/commit/651d4473946096d341a480bbe56793de3fc706aa)
  When parsing String-typed arguments, if the next value is `""`, don't simply
  swallow it. ([@samjonester](https://github.com/samjonester))

#### PERFORMANCE TWEAKS

* [`3370ce8`](https://github.com/npm/nopt/commit/3370ce87a7618ba228883861db84ddbcdff252a9)
  Simplify initialization. ([@elidoran](https://github.com/elidoran))
* [`356e58e`](https://github.com/npm/nopt/commit/356e58e3b3b431a4b1af7fd7bdee44c2c0526a09)
  Store `Array.isArray(types[arg])` for reuse.
  ([@elidoran](https://github.com/elidoran))
* [`0d95e90`](https://github.com/npm/nopt/commit/0d95e90515844f266015b56d2c80b94e5d14a07e)
  Interpret single-item type arrays as a single type.
  ([@samjonester](https://github.com/samjonester))
* [`07c69d3`](https://github.com/npm/nopt/commit/07c69d38b5186450941fbb505550becb78a0e925)
  Simplify key-value extraction. ([@elidoran](https://github.com/elidoran))
* [`39b6e5c`](https://github.com/npm/nopt/commit/39b6e5c65ac47f60cd43a1fbeece5cd4c834c254)
  Only call `Date.parse(val)` once. ([@elidoran](https://github.com/elidoran))
* [`934943d`](https://github.com/npm/nopt/commit/934943dffecb55123a2b15959fe2a359319a5dbd)
  Use `osenv.home()` to find a user's home directory instead of assuming it's
  always `$HOME`. ([@othiym23](https://github.com/othiym23))

#### TEST & CI IMPROVEMENTS

* [`326ffff`](https://github.com/npm/nopt/commit/326ffff7f78a00bcd316adecf69075f8a8093619)
  Fix `/tmp` test to work on Windows.
  ([@elidoran](https://github.com/elidoran))
* [`c89d31a`](https://github.com/npm/nopt/commit/c89d31a49d14f2238bc6672db08da697bbc57f1b)
  Only run Windows tests on Windows, only run Unix tests on a Unix.
  ([@elidoran](https://github.com/elidoran))
* [`affd3d1`](https://github.com/npm/nopt/commit/affd3d1d0addffa93006397b2013b18447339366)
  Refresh Travis to run the tests against the currently-supported batch of npm
  versions. ([@helio](https://github.com/helio)-frota)
* [`55f9449`](https://github.com/npm/nopt/commit/55f94497d163ed4d16dd55fd6c4fb95cc440e66d)
  `tap@8.0.1` ([@othiym23](https://github.com/othiym23))

#### DOC TWEAKS

* [`5271229`](https://github.com/npm/nopt/commit/5271229ee7c810217dd51616c086f5d9ab224581)
  Use JavaScript code block for syntax highlighting.
  ([@adius](https://github.com/adius))
* [`c0d156f`](https://github.com/npm/nopt/commit/c0d156f229f9994c5dfcec4a8886eceff7a07682)
  The code sample in the README had `many2: [ oneThing ]`, and now it has
  `many2: [ two, things ]`. ([@silkentrance](https://github.com/silkentrance))
