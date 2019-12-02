const pageGenerator = require('./generator/page')
const { createFilePath } = require('gatsby-source-filesystem')

exports.createPages = ({
  graphql,
  boundActionCreators: { createPage, createRedirect },
}) => pageGenerator(graphql, createPage, createRedirect)

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNode, createNodeField } = actions

  if (node.internal.type === 'MarkdownRemark') {
    const slug = createFilePath({ node, getNode, basePath: '' })
    createNodeField({
      node,
      name: 'slug',
      value: slug,
    })
  }
}
