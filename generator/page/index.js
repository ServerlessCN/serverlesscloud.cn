const createDoc = require('./doc')
const createCategory = require('./category')
const createBlog = require('./blog')
const createBestPractice = require('./bestPractice')
const createSEOTags = require('./seoTag')

module.exports = (graphql, createPage) => {
  return Promise.all([
    createBlog(graphql, createPage),
    createCategory(graphql, createPage),
    createDoc(graphql, createPage),
    createBestPractice(graphql, createPage),
    createSEOTags(graphql, createPage),
  ])
}
