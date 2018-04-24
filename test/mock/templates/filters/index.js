module.exports = {
  prompts: {
    sass: { type: 'confirm', message: 'Use sass preprocessor?', default: true }
  },
  filters: {
    '*/*.scss': a => a.sass,
    '*/*.css': a => !a.sass
  }
}
