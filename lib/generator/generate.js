const _ = require('lodash')
const chalk = require('chalk')
const minimatch = require('minimatch')
const Metalsmith = require('metalsmith')

const { util } = require('../common')

/**
 * Generate files from template
 * @param {String} src source path
 * @param {String} dest destination path
 * @param {Object} answers answers
 * @param {Object} options template options
 */
module.exports = (src, dest, answers, options) => new Promise((resolve, reject) => {
  const { source, metadata, filters, helpers, plugin } = options

  const metalsmith = Metalsmith(src)

  metalsmith.metadata(Object.assign(metadata, answers))

  // plugin
  typeof plugin === 'function' && metalsmith.use(plugin)

  // filter
  metalsmith.use((files, metalsmith, next) => {
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
  })

  // files rename
  metalsmith.use((files, metalsmith, next) => {
    const metadata = metalsmith.metadata()

    const filenames = Object.keys(files)
    filenames.forEach(original => {
      // // windows path
      // original = original.replace('\\', '\\\\')
      const current = _.template(original, metadata)
      if (current === original) return
      // rename it
      files[current] = files[original]
      delete files[original]
    })

    next()
  })

  // template render
  metalsmith.use((files, metalsmith, next) => {
    const metadata = metalsmith.metadata()

    for (const item in files) {
      let contents = files[item].contents.toString()

      const compiled = _.template(contents, { imports: helpers })
      contents = compiled(metadata)

      files[item].contents = Buffer.from(contents)
    }

    next()
  })

  metalsmith.source(source || 'template')
  metalsmith.destination(dest)
  metalsmith.clean(false)

  metalsmith.build((err, files) => {
    if (err) return reject(err)
    console.log(`\n🎉  "${answers.name}" generated into ${chalk.yellow(util.tildify(dest))}`)
    resolve(files)
  })
})
