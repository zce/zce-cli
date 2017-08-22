<p align="center">
  <a href="http://cli.zce.me"><img src="http://cli.zce.me/assets/logo.png" alt="zce-cli" height="380"></a>
  <p align="center">A scaffolding CLI tool for myself, inspired by vue-cli &amp; yeoman.</p>
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

```sh
# generate a new project from a template
$ zce init <template-name> my-project [--offline] [--debug]

# list available official templates
$ zce list [-s|--short] [--debug]
```

### Commands

- `init` - generate a new project from a template.
- `list|ls` - list available official templates.

### Options 

- `--version, -V` - Print zce-cli version.
- `--help, -h` - Print command help menu.
- `--offline` - Offline mode (Use template cache if that exist).
- `--debug` - Debug mode (Print full exception info).
- `--short, -s` - Short mode (Print short list when `zce list`).

#### Example:

##### Use github repo template

```sh
$ zce init nm my-module
```

The above command pulls the template from [zce-templates/nm](https://github.com/zce-templates/nm), then ask some questions, and generates the project at `./my-module/`.

##### Use local template

Instead of a GitHub repo, you can also use a template on your local file system, e.g.

```sh
$ zce init ~/local/foo my-foo
```

The above command use the template from `~/local/foo`, then ask some questions, and generates the project at `./my-foo/`.

### Official Templates (WIP)

Current available templates list:

- [nm](https://github.com/zce-templates/nm) - Node module boilerplate
- [webapp](https://github.com/zce-templates/webapp) - Modern web app
- [react](https://github.com/zce-templates/react) - Modern web app by React.js
- [vue](https://github.com/zce-templates/vue) - Modern web app by Vue.js
- [jekyll](https://github.com/zce-templates/jekyll) - Static site by Jekyll
- [x-pages](https://github.com/zce-templates/x-pages) - Static site by x-pages
- [electron](https://github.com/zce-templates/electron) - Electron app

Maybe more: https://github.com/zce-templates

> You can also run `zce ls` to see all available official templates in real time.

### Custom Templates

You can simply create and distribute your own template on github, then use it via zce-cli with:

```sh
$ zce init <username>/<repo> my-project
```

#### Create Templates

To create and distribute your own template, refer to [our official documentation](docs/creating.md)

> Maybe fork an official template is a better decision.

## TODOS

- [x] Init command
- [x] List command
- [x] unit test
- [x] Coverage
- [x] Plugins
- [x] e2e test
- [ ] Official documentation
- [ ] Official Templates
- [ ] CLI update notify

## Contributing

1. **Fork** it on GitHub!
2. **Clone** the fork to your own machine.
3. **Checkout** your feature branch: `git checkout -b my-awesome-feature`
4. **Commit** your changes to your own branch: `git commit -am 'Add some feature'`
5. **Push** your work back up to your fork: `git push -u origin my-awesome-feature`
6. Submit a **Pull Request** so that we can review your changes.

> **NOTE**: Be sure to merge the latest from "upstream" before making a pull request!

## License

[MIT](LICENSE) &copy; [汪磊](https://zce.me)
