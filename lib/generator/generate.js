const minimatch = require('minimatch')
const Metalsmith = require('metalsmith')

const { template } = require('../common')

const filter = filters => (files, metalsmith, next) => {
  if (!filters) return next()
  const metadata = metalsmith.metadata()
  const filenames = Object.keys(files)
  Object.keys(filters)
    .filter(glob => !filters[glob](metadata))
    .forEach(glob => {
      const match = minimatch.filter(glob, { dot: true, matchBase: true })
      filenames.forEach(file => match(file) && delete files[file])
    })
  next()
}

const rename = () => (files, metalsmith, next) => {
  const metadata = metalsmith.metadata()

  const filenames = Object.keys(files)
  filenames.forEach(original => {
    // // windows path
    // original = original.replace('\\', '\\\\')
    const current = template.render(original, metadata)
    if (current === original) return
    // rename it
    files[current] = files[original]
    delete files[original]
  })

  next()
}

const render = helpers => (files, metalsmith, next) => {
  const metadata = metalsmith.metadata()

  for (const name in files) {
    let contents = files[name].contents.toString()

    // ignore files that do not have interpolate
    // https://github.com/lodash/lodash/blob/master/.internal/reEvaluate.js
    // https://github.com/lodash/lodash/blob/master/template.js#L19
    if (!(/<%([\s\S]+?)%>/.test(contents) || /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/.test(contents))) {
      continue
    }

    contents = template.render(contents, metadata)
    files[name].contents = Buffer.from(contents)
  }

  next()
}

/**
 * Generate files from template
 * @param {String} src source path
 * @param {String} dest destination path
 * @param {Object} answers answers
 * @param {Object} options template options
 */
module.exports = (src, dest, answers, options = {}) => new Promise((resolve, reject) => {
  const { source, metadata, filters, helpers, plugin } = options

  const metalsmith = Metalsmith(src)

  metalsmith.metadata(Object.assign({}, metadata, answers))

  // helpers
  helpers && template.registerHelpers(helpers)

  // plugin
  typeof plugin === 'function' && metalsmith.use(plugin)

  // filter
  metalsmith.use(filter(filters))

  // files rename
  metalsmith.use(rename())

  // template render
  metalsmith.use(render(helpers))

  metalsmith.source(source || 'template')
  metalsmith.destination(dest)
  metalsmith.clean(false)

  metalsmith.build((err, files) => {
    if (err) return reject(err)
    resolve(files)
  })
})
