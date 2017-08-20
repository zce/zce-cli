# plugin

> Custom metalsmith plugin

```js
module.exports = {
  plugin: (files, app, next) => {
    console.log('before filter')
    next()
    console.log('after render')
  }
}
```
