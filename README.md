# zce-cli

[![Build Status][travis-image]][travis-url]
[![Coverage Status][codecov-image]][codecov-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![NPM Version][version-image]][version-url]
[![License][license-image]][license-url]
[![Dependency Status][dependency-image]][dependency-url]
[![devDependency Status][devdependency-image]][devdependency-url]
[![Code Style][style-image]][style-url]

> A CLI tool for my personal productivity, inspired by gluegun & vue-cli & yeoman & etc.

## Todos

- [x] invoke help
- [x] integration tests
- [x] unit tests
- [x] test files location
  - https://medium.com/@JeffLombardJr/organizing-tests-in-jest-17fc431ff850
- [x] sinon of jest mock?
  - https://medium.com/@rickhanlonii/understanding-jest-mocks-f0046c68e53c
  - https://medium.com/codeclan/mocking-es-and-commonjs-modules-with-jest-mock-37bbb552da43
- [ ] extract core
- [ ] list command
- [ ] init command
- [ ] commands docs

## Issues

- https://stackoverflow.com/questions/55753163/package-json-is-not-under-rootdir#61467483

```javascript
// Re-exports
// https://github.com/microsoft/TypeScript/issues/2726
// export { default as rimraf } from 'rimraf'
// export { default as mkdirp } from 'mkdirp'
// export { default as tildify } from 'tildify'
// export { default as untildify } from 'untildify'
```

lazy-import

## dependencies

⭐️ ejs for templating
⭐️ semver for version investigations
⭐️ fs-jetpack for the filesystem
⭐️ yargs-parser, enquirer, colors, ora and cli-table3 for the command line
⭐️ axios & apisauce for web & apis
⭐️ cosmiconfig for flexible configuration
⭐️ cross-spawn for running sub-commands
⭐️ execa for running more sub-commands
⭐️ node-which for finding executables
⭐️ pluralize for manipulating strings

## devDependencies

- @commitlint/cli
- @commitlint/config-conventional
- @types/execa
- @types/got
- @types/jest
- @types/lodash
- @types/minimist
- @types/node
- @types/semver
- @typescript-eslint/eslint-plugin
- @typescript-eslint/parser
- commitizen
- cz-conventional-changelog
- eslint
- execa
- husky
- jest
- lint-staged
- prettier
- standard-version
- ts-jest
- ts-node
- typescript

## Contributing

1. **Fork** it on GitHub!
2. **Clone** the fork to your own machine.
3. **Checkout** your feature branch: `git checkout -b my-awesome-feature`
4. **Commit** your changes to your own branch: `git commit -am 'Add some feature'`
5. **Push** your work back up to your fork: `git push -u origin my-awesome-feature`
6. Submit a **Pull Request** so that we can review your changes.

> **NOTE**: Be sure to merge the latest from "upstream" before making a pull request!

## License

[MIT](LICENSE) &copy; [汪磊](https://zce.me/)

[travis-image]: https://img.shields.io/travis/zce/zce-cli/next.svg
[travis-url]: https://travis-ci.org/zce/zce-cli
[codecov-image]: https://img.shields.io/codecov/c/github/zce/zce-cli/next.svg
[codecov-url]: https://codecov.io/gh/zce/zce-cli
[downloads-image]: https://img.shields.io/npm/dm/zce-cli.svg
[downloads-url]: https://npmjs.org/package/zce-cli
[version-image]: https://img.shields.io/npm/v/zce-cli.svg
[version-url]: https://npmjs.org/package/zce-cli
[license-image]: https://img.shields.io/github/license/zce/pages-boilerplate.svg
[license-url]: https://github.com/zce/zce-cli/blob/next/LICENSE
[dependency-image]: https://img.shields.io/david/zce/zce-cli.svg
[dependency-url]: https://david-dm.org/zce/zce-cli
[devdependency-image]: https://img.shields.io/david/dev/zce/zce-cli.svg
[devdependency-url]: https://david-dm.org/zce/zce-cli?type=dev
[style-image]: https://img.shields.io/badge/code_style-standard-brightgreen.svg
[style-url]: http://standardjs.com


 chalk got minimist minimist-options mkdirp ora redent rimraf tildify untildify zce

 @commitlint/cli @commitlint/config-conventional @types/execa @types/got @types/jest @types/lodash @types/minimist @types/mkdirp @types/node @types/rimraf @types/semver @typescript-eslint/eslint-plugin @typescript-eslint/parser commitizen cz-conventional-changelog eslint execa husky jest lint-staged prettier standard-version ts-jest ts-node typescript

{
  "compilerOptions": {
    "allowSyntheticDefaultImports": true,
    "baseUrl": "src",
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "module": "commonjs",
    "moduleResolution": "node",
    "noImplicitAny": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "outDir": "lib",
    "paths": {
      "@*": ["src/*"]
    },
    "strict": true,
    "target": "es2017"
  },
  "exclude": ["src/**/*.test.ts"],
  "include": ["src/**/*.ts"]
}

const loadCommands = (dir: string) => new Proxy<Record<string, Command>>({}, {
  get (target, name) {
    if (Reflect.has(target, name)) return Reflect.get(target, name)
    try {
      const cmd = require(dir + '/' + name.toString()) as Command
      Reflect.set(target, name, cmd)
      return cmd
    } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND') {
        throw e
      }
    }
  }
})
