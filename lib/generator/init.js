/**
 * Generate a new project from a template
 * @param {String}  template        template name or uri
 * @param {String}  project         project destination
 * @param {Object}  options         options
 * @param {Boolean} options.list    list available official templates
 * @param {Boolean} options.offline use cached template
 * @param {Boolean} options.debug   debug mode
 */
module.exports = (template, project, options) => {
  if (options.list) {

  }

  const { offline, debug } = options
  console.log(options)
  // 判断是否为列表查看操作

  // 判断目标路径是否存在
  // 找到模板
  // 加载模板（配置文件）
  // UI 交互（采集用户输入）
  // 生成项目文件
  // UI 提示
}
