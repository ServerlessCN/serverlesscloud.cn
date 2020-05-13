const path = require('path')
const BLOG_PAGESIZE = 10

/**
 * 创建SEO tag聚合页
 */
function createCategory(graphql, createPage) {
  return graphql(`
    query {
      allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/blog|best-practice/" } }
      ) {
        group(field: frontmatter___tags) {
          totalCount
          tags: fieldValue
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors)
    }

    const tags = result.data.allMarkdownRemark.group

    tags.forEach(({ tags, totalCount }) => {
      const pages = Math.ceil(totalCount / BLOG_PAGESIZE)
      new Array(pages).fill(0).forEach((o, page) => {
        createPage({
          path: `tags/${tags}${page === 0 ? '' : '/page/' + (page + 1)}`,
          component: path.resolve(
            __dirname,
            '../../src/templates/BlogListWithTag.tsx'
          ),
          context: {
            limit: BLOG_PAGESIZE,
            offset: page * BLOG_PAGESIZE,
            tags,
          },
        })
      })
    })
  })
}

module.exports = createCategory
