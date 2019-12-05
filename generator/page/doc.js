const path = require('path')

/**
 * 创建文档页
 */
function createDoc(graphql, createPage) {
  return graphql(`
    query {
      allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/docs/" } }) {
        nodes {
          frontmatter {
            link
          }
          fileAbsolutePath
          id
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors)
    }


    const docs = result.data.allMarkdownRemark.nodes
    docs.forEach(doc => {
      // filePath like /xxx/xxx
      console.log(doc)
      if (doc.fileAbsolutePath.indexOf('/docs') === -1) return 
      const [, filePath] = doc.fileAbsolutePath.split('/docs')
      const filePathWithoutExt = filePath.replace('.md', '')

      const isIndex = filePathWithoutExt === '/index'
      const routePath = isIndex
        ? '/doc'
        : `/doc${(doc.frontmatter && doc.frontmatter.link) || doc.id}`
      createPage({
        path: routePath,
        component: path.resolve(__dirname, '../../src/templates/Doc.tsx'),
        context: {
          docId: doc.id,
          currentPath: routePath,
        },
      })
    })
  })
}

module.exports = createDoc
