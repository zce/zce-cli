# zce-cli

[![License][license-img]][license-url]
[![NPM Downloads][downloads-img]][downloads-url]
[![NPM Version][version-img]][version-url]
[![Dependency Status][dependency-img]][dependency-url]
[![devDependency Status][devdependency-img]][devdependency-url]
[![Code Style][style-img]][style-url]

> A CLI tool for my personal productivity.

## Installation

```shell
$ npm install zce-cli

# or yarn
$ yarn add zce-cli
```

## Usage

<!-- TODO: Introduction of Usage -->

```javascript
const zceCli = require('zce-cli')
const result = zceCli('w')
// result => 'w@zce.me'
```

## API

<!-- TODO: Introduction of API -->

### zceCli(input, options?)

#### input

- Type: `string`
- Details: name string

#### options

##### host

- Type: `string`
- Details: host string
- Default: `'zce.me'`

## CLI Usage

<!-- TODO: Introduction of CLI -->

Use npx:

```shell
$ npx zce-cli <input> [options]
```

Globally install:

```shell
$ npm install zce-cli -g
# or yarn
$ yarn global add zce-cli
```

```shell
$ zce-cli --help
zce-cli/0.1.0

Usage:
  $ zce-cli <input>

Commands:
  <input>  Sample cli program

For more info, run any command with the `--help` flag:
  $ zce-cli --help

Options:
  --host <host>  Sample options
  -h, --help     Display this message
  -v, --version  Display version number

Examples:
  $ zce-cli w --host zce.me
```

## Contributing

1. **Fork** it on GitHub!
2. **Clone** the fork to your own machine.
3. **Checkout** your feature branch: `git checkout -b my-awesome-feature`
4. **Commit** your changes to your own branch: `git commit -am 'Add some feature'`
5. **Push** your work back up to your fork: `git push -u origin my-awesome-feature`
6. Submit a **Pull Request** so that we can review your changes.

> **NOTE**: Be sure to merge the latest from "upstream" before making a pull request!

## License

[MIT](LICENSE) &copy; [zce](https://zce.me)



[license-img]: https://img.shields.io/github/license/zce/zce-cli
[license-url]: https://github.com/zce/zce-cli/blob/master/LICENSE
[downloads-img]: https://img.shields.io/npm/dm/zce-cli
[downloads-url]: https://npm.im/zce-cli
[version-img]: https://img.shields.io/npm/v/zce-cli
[version-url]: https://npm.im/zce-cli
[dependency-img]: https://img.shields.io/david/zce/zce-cli
[dependency-url]: https://david-dm.org/zce/zce-cli
[devdependency-img]: https://img.shields.io/david/dev/zce/zce-cli
[devdependency-url]: https://david-dm.org/zce/zce-cli?type=dev
[style-img]: https://img.shields.io/badge/code_style-standard-brightgreen
[style-url]: https://standardjs.com
