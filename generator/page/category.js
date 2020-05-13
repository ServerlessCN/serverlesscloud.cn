const path = require('path')
const BLOG_PAGESIZE = 10

/**
 * 创建博客目录页
 */
function createCategory(graphql, createPage) {
  return graphql(`
    query {
      allMarkdownRemark(
        filter: {
          frontmatter: { categories: { nin: "guides-and-tutorials" } }
          fileAbsolutePath: { regex: "/blog/" }
        }
      ) {
        group(field: frontmatter___categories) {
          totalCount
          categories: fieldValue
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors)
    }

    const categories = result.data.allMarkdownRemark.group
    categories.forEach(({ categories, totalCount }) => {
      const pages = Math.ceil(totalCount / BLOG_PAGESIZE)
      new Array(pages).fill(0).forEach((o, page) => {
        createPage({
          path: `category/${categories}${
            page === 0 ? '' : '/page/' + (page + 1)
          }`,
          component: path.resolve(
            __dirname,
            '../../src/templates/BlogListWithCategory.tsx'
          ),
          context: {
            limit: BLOG_PAGESIZE,
            offset: page * BLOG_PAGESIZE,
            categories,
          },
        })
      })
    })
  })
}

module.exports = createCategory
