const path = require('path')

const BLOG_PAGESIZE = 10

function createBlogList(blogs, createPage) {
  const pages = Math.ceil(blogs.length / BLOG_PAGESIZE)

  new Array(pages).fill(0).forEach((o, page) => {
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

function createBlogListWithCategory(categories, createPage) {
  console.log(categories)
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
}

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
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors)
    }

    const blogs = result.data.allMarkdownRemark.edges
    createBlog(blogs, createPage)
    createBlogList(blogs, createPage)
  })
}

function createBlogWithCategoryTask(graphql, createPage) {
  return graphql(`
    query {
      allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/blog/" } }) {
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

    const categorys = result.data.allMarkdownRemark.group
    createBlogListWithCategory(categorys, createPage)
  })
}

function createDoc(graphql, createPage) {
  return graphql(`
    query {
      allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/docs/" } }) {
        nodes {
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
      const [, filePath] = doc.fileAbsolutePath.split('/docs')

      if (!filePath) {
        return
      }

      const filePathWithoutExt = filePath.replace('.md', '')

      const routePath = `doc${
        filePathWithoutExt === '/index' ? '' : filePathWithoutExt
      }`

      createPage({
        path: routePath,
        component: path.resolve(__dirname, '../../src/templates/Doc.tsx'),
        context: {
          docId: doc.id,
          currentPath: `/${routePath}`,
        },
      })
    })
  })
}

module.exports = (graphql, createPage, createRedirect) => {
  return Promise.all([
    createBlogTask(graphql, createPage),
    createBlogWithCategoryTask(graphql, createPage),
    createDoc(graphql, createPage),
  ])
}
