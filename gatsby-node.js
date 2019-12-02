const pageGenerator = require('./generator/page')
const { createFilePath } = require('gatsby-source-filesystem')
let docMenuConfig = require('./src/constants/docMenuConfig')

let { baseUrl, config, configMap } = docMenuConfig

exports.createPages = ({
  graphql,
  boundActionCreators: { createPage, createRedirect },
}) => pageGenerator(graphql, createPage, createRedirect)

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNode, createNodeField } = actions

  if (node.internal.type === 'MarkdownRemark') {
    const slug = createFilePath({ node, getNode, basePath: '' })

    if (node.fileAbsolutePath.indexOf('/docs/') !== -1) {
      const [, filePath] = node.fileAbsolutePath.split('/docs')
      const filePathWithoutExt = filePath.replace('.md', '')

      const docsFilePaths = Object.keys(configMap)
      const targetFilePath = docsFilePaths.find(
        o => node.fileAbsolutePath.indexOf(o) !== -1
      )

      const isIndex = filePathWithoutExt === '/index'
      if (isIndex) {
        createNodeField({
          node,
          name: 'slug',
          value: baseUrl,
        })
      } else if (targetFilePath && configMap[targetFilePath]) {
        createNodeField({
          node,
          name: 'slug',
          value: configMap[targetFilePath].to,
        })
      }
    } else {
      createNodeField({
        node,
        name: 'slug',
        value: slug,
      })
    }
  }
}
