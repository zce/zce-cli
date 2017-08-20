# filters

> Custom template filters

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
