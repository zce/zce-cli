# plugin-template

> A project template for [zce-cli](https://github.com/zce/zce-cli)

## Custom metalsmith plugin

```js
module.exports = {
  plugin: (files, app, next) => {
    const metadata = app.metadata()
    console.log('before filter')
    next()
    console.log('after render')
  }
}
```

## License

[MIT](LICENSE) &copy; [汪磊](https://zce.me)
