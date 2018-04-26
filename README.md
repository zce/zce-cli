<p align="center">
  <a href="http://cli.zce.me"><img src="http://cli.zce.me/assets/logo.png" alt="zce-cli" height="380"></a>
  <p align="center">A CLI tool for my personal productivity, inspired by vue-cli &amp; yeoman &amp; etc.</p>
</p>
<p align="center">
  <a href="https://travis-ci.org/zce/zce-cli"><img src="https://img.shields.io/travis/zce/zce-cli.svg" alt="Build Status"></a>
  <a href="https://codecov.io/gh/zce/zce-cli"><img src="https://img.shields.io/codecov/c/github/zce/zce-cli.svg" alt="Coverage Status"></a>
  <a href="https://npmjs.org/package/zce-cli"><img src="https://img.shields.io/npm/dm/zce-cli.svg" alt="NPM Downloads"></a>
  <a href="https://npmjs.org/package/zce-cli"><img src="https://img.shields.io/npm/v/zce-cli.svg" alt="NPM Version"></a>
  <br>
  <a href="https://github.com/zce/zce-cli/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/zce-cli.svg" alt="License"></a>
  <a href="http://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="Code Style"></a>
  <a href="https://david-dm.org/zce/zce-cli"><img src="https://img.shields.io/david/zce/zce-cli.svg" alt="Dependencies Status"></a>
  <a href="https://david-dm.org/zce/zce-cli?type=dev"><img src="https://img.shields.io/david/dev/zce/zce-cli.svg" alt="DevDependencies Status"></a>
</p>
<br>

## Installation

```sh
# install it globally
$ yarn global add zce-cli

# or npm
$ npm install -g zce-cli
```

## Usage

### Generator

> Simple scaffolding for generate project.

#### init

```sh
# generate a new project from a template
$ zce init <template-name> [my-project] [-o|--offline] [-f|--force] [-s|--save]
```
##### Options

- `-f, --force`: overwrite target directory if it exists
- `-o, --offline`: offline mode, use cached template
- `-s, --save`: save the answers for the next
- `-h, --help`: output usage information

##### Example

###### Use github repo template

```sh
$ zce init nm my-module
```

The above command pulls the template from [zce-templates/nm](https://github.com/zce-templates/nm), then ask some questions, and generate the project at `./my-module`.

###### Use local template

Instead of a GitHub repo, you can also use a template on your local file system, e.g.

```sh
$ zce init ~/local/foo my-foo
```

The above command use the template from `~/local/foo`, then ask some questions, and generates the project at `./my-foo`.

#### list

```sh
# list available official templates
$ zce list [-s|--short]
```

##### Options

- `-s, --short`: short list display
- `-h, --help`: output usage information

#### Official Templates

Current available templates list:

- [x] [template](https://github.com/zce-templates/template) - Templates template
- [x] [nm](https://github.com/zce-templates/nm) - Node module boilerplate
- [ ] [webapp](https://github.com/zce-templates/webapp) - :construction: Modern web app
- [ ] [react](https://github.com/zce-templates/react) - :construction: Modern web app by React.js
- [ ] [vue](https://github.com/zce-templates/vue) - :construction: Modern web app by Vue.js
- [ ] [jekyll](https://github.com/zce-templates/jekyll) - :construction: Static site by Jekyll
- [ ] [electron](https://github.com/zce-templates/electron) - :construction: Electron app
- [ ] [x-pages](https://github.com/zce-templates/x-pages) - :construction: Static site by x-pages

Maybe more: https://github.com/zce-templates

> You can also run `zce ls` to see all available official templates in real time.

#### Create Your Template

To create and distribute your own template, refer to [Create new template](doc/create-template.md).

> Maybe fork an official template or use [zce-templates/template](https://github.com/zce-templates/template) is a better decision.

### Server (WIP)

> Simple static site develop workflow.

:construction:

### Maybe more...

## API Usage

You can use it in your CLI program.

```js
const { generator, server } = require('zce-cli')

// ...

// generate a new project from a template
await generator.init(template, project, { force, offline, save })

// ...

// list available official templates
generator.list(username, { short })

// ...
```

## TODOS

### Generator

- [x] list command
- [x] init command
- [x] unit test
- [ ] e2e test
- [ ] Official Templates

### Server

- [ ] Planning

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



[travis-image]: https://img.shields.io/travis/zce/zce-cli.svg
[travis-url]: https://travis-ci.org/zce/zce-cli
[codecov-image]: https://img.shields.io/codecov/c/github/zce/zce-cli.svg
[codecov-url]: https://codecov.io/gh/zce/zce-cli
[downloads-image]: https://img.shields.io/npm/dm/zce-cli.svg
[downloads-url]: https://npmjs.org/package/zce-cli
[version-image]: https://img.shields.io/npm/v/zce-cli.svg
[version-url]: https://npmjs.org/package/zce-cli
[license-image]: https://img.shields.io/npm/l/zce-cli.svg
[license-url]: https://github.com/zce/zce-cli/blob/master/LICENSE
[dependency-image]: https://img.shields.io/david/zce/zce-cli.svg
[dependency-url]: https://david-dm.org/zce/zce-cli
[devdependency-image]: https://img.shields.io/david/dev/zce/zce-cli.svg
[devdependency-url]: https://david-dm.org/zce/zce-cli?type=dev
[style-image]: https://img.shields.io/badge/code_style-standard-brightgreen.svg
[style-url]: http://standardjs.com
