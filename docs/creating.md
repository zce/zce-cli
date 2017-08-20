# Writing your own template

In reading this section, you'll learn how to create and distribute your own template.

## Template structure

```
└── my-template
    ├── template ···································· Template source files directory (Required)
    │   ├── assets ·································· Any directory (Recurse all subdirectories)
    │   │   ├── logo.png ···························· Any file (Auto skip binary file)
    │   │   └── style.css ··························· Any file (Auto render mustache)
    │   └── index.html ······························ Any file (Auto render mustache)
    ├── index.js ···································· Entry point (Optional, Configuration file)
    └── README.md ··································· README (Optional)
```

## Generate a template from a template

We built a [template](https://github.com/zce-templates/template) to help users get started with their own template. Feel free to use it to bootstrap your own template once you understand the below concepts.

```sh
$ zce init template my-template
```

## Configuration

A template repo may have a config file for the template which can be either a `index.js` or `main file` defined in `package.json`.

It must export an object:

```js
module.exports = {}
```

### Options

Config file can contain the following fields:

#### name

- Type: `string`
- Details: Name of template.

#### version

- Type: `string`
- Details: Version of template.

#### source

- Type: `string`
- Default: 'template'
- Details: Template source files directory name.
- Example: [custom-source](../test/mock/source)

#### metadata

- Type: `string`
- Details: The metadata you can use in the template.
- Usage:
  ```js
  module.exports = {
    metadata: {
      title: 'hello zce-cli'
    }
  }
  ```
  Upon definition, they can be used as follows:
  ```hbs
  {{title}}
  // => 'hello zce-cli'
  ```

#### prompts

- Type: `Object`
- Details: Used to collect user input in CLI.
- Example: [custom-prompts](../test/mock/prompts)
- Usage:
  ```js
  module.exports = {
    prompts: {
      name: { type: 'input', message: 'Project name' },
      description: { type: 'input', message: 'Project description', default: 'A jekyll project' },
      author: { type: 'input', message: "Project author" },
      version: { type: 'input', message: "Project version" },
      license: { type: 'input', message: "Project license" },
      repository: { type: 'input', message: "Project repository" },
      sass: { type: 'confirm', message: 'Use sass preprocessor?', default: true }
    }
  }
  ```

#### complete

- Type: `string` or `Function`
- Details: Generate completed callback. if got a string, print it to the console.
- Example: [custom-complete](../test/mock/complete)
- Usage:
  ```js
  module.exports = {
    complete: context => {
      console.log('  To get started:')
      console.log()
      context.inPlace || console.log(`    $ cd ${require('path').relative(process.cwd(), context.dest)}`)
      console.log('    $ npm install')
      console.log('    $ npm run dev')
      console.log()
      console.log('  Good luck~')
    }
  }
  // or
  module.exports = {
    complete: '{{answers.name}}\n{{src}} → {{dest}}'
  }
  ```

#### filters

- Type: `Object`
- Details: Used to conditional filter files to output.
- Example: [custom-filters](../test/mock/filters)
- Usage:
  ```js
  module.exports = {
    prompts: {
      sass: { type: 'confirm', message: 'Use sass preprocessor?', default: true }
    },
    filters: {
      '*/*.scss': a => a.sass,
      '*/*.css': a => !a.sass
    }
  }
  ```

#### helpers

- Type: `Object`
- Details: Used to custom handlebars helpers.
- Example: [custom-helpers](../test/mock/helpers)
- Usage:
  ```js
  module.exports = {
    helpers: {
      uppercase: str => str.toUpperCase()
    }
  }
  ```
  Upon registration, they can be used as follows:
  ```hbs
  {{uppercase 'zce'}}
  // => 'ZCE'
  ```

#### plugin

- Type: `Object`
- Details: Used to add custom metalsmith middleware.
- Example: [custom-plugin](../test/mock/plugin)
- Usage:
  ```js
  module.exports = {
    plugin: (files, app, next) => {
      console.log('before filter')
      next()
      console.log('after render')
    }
  }
  ```
