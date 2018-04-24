# filters-template

> A project template for [zce-cli](https://github.com/zce/zce-cli)

## Custom template filters

```js
module.exports = {
  prompts: {
    sass: { type: 'confirm', message: 'Use sass preprocessor?', default: true }
  },
  filters: {
    // params is prompts answers
    '*/*.scss': answers => answers.sass,
    '*/*.css': answers => !answers.sass
  }
}
```

## License

[MIT](LICENSE) &copy; [汪磊](https://zce.me)
