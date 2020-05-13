// 列表页面的一页展示长度
const path = require('path')
const fs = require('fs')
const PAGESIZE = 10

/**
 * 创建博客列表页
 */
function createBestPracticeList(blogs, createPage) {
  const pages = Math.ceil(blogs.length / PAGESIZE)

  new Array(pages).fill(0).forEach((_, page) => {
    const commonParams = {
      component: path.resolve(
        __dirname,
        '../../src/templates/BestPracticeList.tsx'
      ),
      context: {
        limit: PAGESIZE,
        offset: page * PAGESIZE,
      },
    }

    if (page === 0) {
      createPage({
        path: `best-practice`,
        ...commonParams,
      })
    }

    createPage({
      ...commonParams,
      path: `best-practice/page/${page + 1}`,
    })
  })
}
/**
 * 创建博客详情页
 */
function createBestPractice(blogs, createPage) {
  blogs.forEach(({ node: { id: blogId, fileAbsolutePath } }, index) => {
    createPage({
      path: `best-practice/${path.basename(
        fileAbsolutePath,
        path.extname(fileAbsolutePath)
      )}`,
      component: path.resolve(
        __dirname,
        '../../src/templates/BestPracticeDetail.tsx'
      ),
      context: {
        blogId,
        previousBlogId: index === 0 ? null : blogs[index - 1].node.id,
        nextBlogId:
          index === blogs.length - 1 ? null : blogs[index + 1].node.id,
      },
    })
  })
}

/**
 * 创建博客列表页
 */
function createBestPracticeTask(graphql, createPage) {
  return graphql(`
    query {
      allMarkdownRemark(
        sort: { fields: frontmatter___date, order: DESC }
        filter: {
          frontmatter: {
            categories: { regex: "/best-practice|guides-and-tutorials/" }
          }
          fileAbsolutePath: { regex: "/best-practice|blog/" }
        }
      ) {
        totalCount
        edges {
          node {
            id
            frontmatter {
              thumbnail
              authors
              date
              title
              description
              authorslink
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
      fs.writeFileSync('./src/constants/bestPractice.json', buff)
    }
    createBestPractice(blogs, createPage)
    createBestPracticeList(blogs, createPage)
  })
}

module.exports = createBestPracticeTask
