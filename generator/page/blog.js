const path = require('path')
const fs = require('fs')
const BLOG_PAGESIZE = 10

/**
 * 创建博客列表页
 */
function createBlogList(blogs, createPage) {
  const pages = Math.ceil(blogs.length / BLOG_PAGESIZE)

  new Array(pages).fill(0).forEach((_, page) => {
    const commonParams = {
      component: path.resolve(__dirname, '../../src/templates/BlogList.tsx'),
      context: {
        limit: BLOG_PAGESIZE,
        offset: page * BLOG_PAGESIZE,
      },
    }

    if (page === 0) {
      createPage({
        path: `blog`,
        ...commonParams,
      })
    }

    createPage({
      ...commonParams,
      path: `blog/page/${page + 1}`,
    })
  })
}
/**
 * 创建博客详情页
 */
function createBlog(blogs, createPage) {
  blogs.forEach(
    (
      {
        node: {
          id: blogId,
          frontmatter: { categories },
          fileAbsolutePath,
        },
      },
      index
    ) => {
      createPage({
        path: `blog/${path.basename(
          fileAbsolutePath,
          path.extname(fileAbsolutePath)
        )}`,
        component: path.resolve(
          __dirname,
          '../../src/templates/BlogDetail.tsx'
        ),
        context: {
          blogId,
          previousBlogId: index === 0 ? null : blogs[index - 1].node.id,
          nextBlogId:
            index === blogs.length - 1 ? null : blogs[index + 1].node.id,
          categories,
        },
      })
    }
  )
}

/**
 * 创建博客列表页
 */
function createBlogTask(graphql, createPage) {
  return graphql(`
    query {
      allMarkdownRemark(
        sort: { fields: frontmatter___date, order: DESC }
        filter: { fileAbsolutePath: { regex: "/blog/" } }
      ) {
        totalCount
        edges {
          node {
            id
            frontmatter {
              thumbnail
              authors
              categories
              date
              title
              description
              authorslink
              translators
              translatorslink
            }
            wordCount {
              words
              sentences
              paragraphs
            }
            fileAbsolutePath
            timeToRead
            fields {
              slug
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors)
    }

    const blogs = result.data.allMarkdownRemark.edges
    if (blogs) {
      const buff = JSON.stringify(blogs)
      fs.writeFileSync('./src/constants/blog.json', buff)
    }
    createBlog(blogs, createPage)
    createBlogList(blogs, createPage)
  })
}

module.exports = createBlogTask
