module.exports = {
  plugin: (files, app, next) => {
    const metadata = app.metadata()
    metadata.plugin = 'zce plugin'
    next()
    const contents = files['zce.txt'].contents.toString().trim()
    files['zce.txt'].contents = Buffer.from(contents + ' intercept')
  }
}
